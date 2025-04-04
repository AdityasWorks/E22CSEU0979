const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "http://20.244.56.144/evaluation-service";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
});


app.get("/users", async (req, res) => {
    try {
        const response = await api.get("/users");
        const users = response.data.users;
        let userPostCounts = [];
        
        for (const id of Object.keys(users)) {
            const postsResponse = await api.get(`/users/${id}/posts`);
            userPostCounts.push({ id, name: users[id], postCount: postsResponse.data.posts.length });
        }
        
        userPostCounts.sort((a, b) => b.postCount - a.postCount);
        res.json({ topUsers: userPostCounts.slice(0, 5) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch top users" });
    }
});

app.get("/posts", async (req, res) => {
    const { type } = req.query;
    if (!["popular", "latest"].includes(type)) {
        return res.status(400).json({ error: "Query param 'type' must be 'popular' or 'latest'" });
    }
    try {
        const usersResponse = await api.get("/users");
        const users = usersResponse.data.users;
        let allPosts = [];
        
        for (const id of Object.keys(users)) {
            const postsResponse = await api.get(`/users/${id}/posts`);
            allPosts = allPosts.concat(postsResponse.data.posts || []);
        }
        
        if (type === "latest") {
            allPosts.sort((a, b) => b.id - a.id);
        } else {
            for (let post of allPosts) {
                const commentsResponse = await api.get(`/posts/${post.id}/comments`);
                post.commentCount = commentsResponse.data.comments ? commentsResponse.data.comments.length : 0;
            }
            const maxComments = Math.max(...allPosts.map(p => p.commentCount));
            allPosts = allPosts.filter(p => p.commentCount === maxComments);
        }
        res.json(allPosts.slice(0, 5));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
