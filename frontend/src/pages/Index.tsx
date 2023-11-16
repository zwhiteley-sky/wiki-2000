import { useLoaderData } from "react-router-dom";

export function index_loader({ request }: { request: Request }) {
    return fetch("http://localhost:3000/articles", {
        signal: request.signal
    });
}

export default function Index() {
    const data: any = useLoaderData();

    return (
        <>
            {
                data.map((article: any) => <h1 key={article.id}>{article.title}</h1>)
            }
        </>
    )
}