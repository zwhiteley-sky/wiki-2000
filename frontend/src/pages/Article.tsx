import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const Article = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);


    useEffect(() => {
        const fetchArticle = async () => {
            try {

                // Featch the individual article based on the provided ID
                const response = await fetch(`http://localhost:3000/articles/${id}`);
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching article:', error)
            }
        };
            // Call the fetchAticle function when ID parameter changes 
        fetchArticle();
    }, [id]);

    if (!article) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.text}</p>
            <p>Author: {article.author.name}</p>
            <p>Created At: {article.created_at}</p>
            <h3>Tags:</h3>
            <ul>
                {article.tags.map((tag) => (
                    <li key={tag.id}>{tag.name}</li>
                ))}
            </ul>
        </div>
    )
}       
  
export default Article; 