import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:3000/articles');
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error)
            }
        };

        fetchArticles();
    }, []);
  
    return (
        <div>
            <h1>Articles</h1>
            {articles.slice(0, 6).map((article) => (
                <div key={article.id}>
                    <h2>{article.title}</h2>
                    <p>{article.summary}</p>
                    <p>Author: {article.author.name}</p>
                    <Link to={`/article/${article.id}`}>Read more</Link>
                </div>
            ))}
        </div>
    )
}   

export default Index;