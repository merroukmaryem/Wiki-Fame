import { useState, useEffect } from 'react'
import './App.css'
import { ResultsList, SearchBar } from "./components/atoms/composants.tsx";

// Type pour les résultats de film
interface MovieResult {
    title: string;
    poster: string;
    plot: string;
}

function App() {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // État global des résultats avec mémoïsation
    const [movieCache, setMovieCache] = useState<Record<string, MovieResult>>({})
    const [currentMovie, setCurrentMovie] = useState<MovieResult | null>(null)

    useEffect(() => {
        if (!searchQuery.trim()) {
            setCurrentMovie(null)
            return
        }

        // Vérifier si le résultat est déjà en cache
        if (movieCache[searchQuery.toLowerCase()]) {
            setCurrentMovie(movieCache[searchQuery.toLowerCase()])
            return
        }

        const fetchMovie = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`http://www.omdbapi.com/?apikey=214764f3&t=${encodeURIComponent(searchQuery)}`)

                if (!response.ok) {
                    throw new Error('Erreur réseau')
                }

                const data = await response.json()

                if (data.Response === 'False') {
                    throw new Error(data.Error || 'Film non trouvé')
                }

                const movieData = {
                    title: data.Title,
                    poster: data.Poster,
                    plot: data.Plot
                }

                // Mise à jour du cache
                setMovieCache(prev => ({
                    ...prev,
                    [searchQuery.toLowerCase()]: movieData
                }))

                setCurrentMovie(movieData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue')
                setCurrentMovie(null)
            } finally {
                setIsLoading(false)
            }
        }

        // Délai pour éviter les appels trop fréquents
        const timer = setTimeout(() => {
            fetchMovie()
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, movieCache])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const input = form.elements.namedItem('search') as HTMLInputElement
        setSearchQuery(input.value.trim())
    }

    return (
        <div className="app-container">
            <h1>Wiki Fame</h1>

            <SearchBar onSubmit={handleSubmit} />

            {isLoading && <div className="loading">Chargement...</div>}
            {error && <div className="error">{error}</div>}

            {currentMovie && (
                <ResultsList
                    nom={currentMovie.title}
                    photoUrl={currentMovie.poster}
                    description={currentMovie.plot}
                />
            )}
        </div>
    )
}

export default App