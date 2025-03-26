import * as React from "react";

interface SearchBarProps {
    onSubmit?: (e: React.FormEvent) => void;
}

export const SearchBar = ({ onSubmit }: SearchBarProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <form id='searchBar' onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="name"
                name="search"
            />
        </form>
    );
};

interface ResultsListProps {
    nom: string;
    photoUrl: string;
    description: string;
}

export const ResultsList = ({ nom, photoUrl, description }: ResultsListProps) => {
    return (
        <div id="movie-info">
            <h2>{nom}</h2>
            {photoUrl && <img src={photoUrl} alt={nom} />}
            <p>{description}</p>
        </div>
    );
};