import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditItem(props) {
    const { id } = useParams();
    const [item, setItem] = useState({});
    const [title, setTitle] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/items/${props.id}`);

                if (data) {
                    setItem(data);
                    setTitle(data.title);
                }
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
                setError(true);
            }
        };
        fetchData();
    }, [props.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/items/${props.id}`, {
                title,
            });

            if (data) {
                setItem(data);
            }
        } catch (error) {
            console.error("Erreur dans la mise à jour de l'item:", error);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.delete(`/api/items/${props.id}`);
            console.log(data);

            if (data) {
                window.location.href = data.redirectUrl;
            }
        } catch (error) {
            console.error("Erreur lors de la suppression item:", error);
        }
    };

    if (!item) {
        return <div>Chargement...</div>;
    }

    if (error) {
        window.location.href = "/items";
    }

    return (
        <div>
            <h1>Modifier l'item</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Titre :</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button type="submit">Enregistrer</button>
                </form>
                <form onSubmit={handleDelete}>
                    <button type="submit">Supprimer</button>
                </form>
            </div>
        </div>
    );
}
