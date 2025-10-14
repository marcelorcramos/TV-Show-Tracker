import { useState, useEffect } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

// Dados mockados de TV shows
const MOCK_TV_SHOWS = [
  {
    id: 1,
    title: "Breaking Bad",
    genre: "Drama",
    type: "Series",
    rating: 9.5,
    imageUrl: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
    description: "A high school chemistry teacher diagnosed with cancer turns to a life of crime to secure his family's future.",
    seasons: 5
  },
  {
    id: 2,
    title: "Stranger Things",
    genre: "Sci-Fi",
    type: "Series", 
    rating: 8.7,
    imageUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.",
    seasons: 4
  },
  {
    id: 3,
    title: "Game of Thrones",
    genre: "Fantasy",
    type: "Series",
    rating: 9.3,
    imageUrl: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    seasons: 8
  },
  {
    id: 4,
    title: "The Witcher",
    genre: "Fantasy", 
    type: "Series",
    rating: 8.2,
    imageUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    seasons: 3
  },
  {
    id: 5,
    title: "The Last of Us",
    genre: "Drama",
    type: "Series",
    rating: 8.8,
    imageUrl: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    seasons: 1
  },
  {
    id: 6,
    title: "Friends",
    genre: "Comedy",
    type: "Series",
    rating: 8.9,
    imageUrl: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
    seasons: 10
  },
  {
    id: 7,
    title: "The Dark Knight",
    genre: "Action",
    type: "Movie",
    rating: 9.0,
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    duration: 152
  },
  {
    id: 8,
    title: "Inception",
    genre: "Sci-Fi",
    type: "Movie", 
    rating: 8.8,
    imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: 148
  },
  {
    id: 9,
    title: "Forrest Gump",
    genre: "Drama",
    type: "Movie",
    rating: 8.8,
    imageUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
    duration: 142
  },
  {
    id: 10,
    title: "Avengers: Endgame",
    genre: "Action", 
    type: "Movie",
    rating: 8.4,
    imageUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
    duration: 181
  }
];

export const useRecommendations = (limit = 6) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { favorites, getFavoriteGenres } = useFavorites();

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log('🎯 useRecommendations - Iniciando...', {
        favoritesCount: favorites.length,
        favoriteGenres: getFavoriteGenres()
      });

      if (favorites.length === 0) {
        console.log('ℹ️ Nenhum favorito, limpando recomendações');
        setRecommendations([]);
        return;
      }

      setLoading(true);
      
      // Simular loading
      setTimeout(() => {
        try {
          const favoriteGenres = getFavoriteGenres();
          
          console.log('🎭 Gêneros favoritos encontrados:', favoriteGenres);
          
          if (favoriteGenres.length === 0) {
            console.log('ℹ️ Nenhum gênero encontrado nos favoritos');
            setRecommendations([]);
            return;
          }

          // Filtrar shows que nao estão nos favoritos
          const nonFavoriteShows = MOCK_TV_SHOWS.filter(
            show => !favorites.some(fav => fav.id === show.id)
          );

          console.log('📺 Shows não favoritados:', nonFavoriteShows.length);

          // Criar array de recomendações baseadas nos gêneros favoritos
          const recommendedByGenre = [];

          // Para cada gênero favorito, pegar os melhores shows desse gênero
          favoriteGenres.forEach(genre => {
            const showsInGenre = nonFavoriteShows.filter(
              show => show.genre === genre
            );
            
            console.log(`🎭 Gênero "${genre}": ${showsInGenre.length} shows`);

            // Pegar os 2 melhores shows de cada gênero (baseado no rating)
            const topShowsInGenre = showsInGenre
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 2);

            recommendedByGenre.push(...topShowsInGenre);
          });

          console.log('⭐ Recomendações por gênero:', recommendedByGenre.length);

          let finalRecommendations = [];
          
          if (recommendedByGenre.length === 0) {
            console.log('🎲 Nenhuma recomendação por gênero, usando shows bem avaliados');
            finalRecommendations = nonFavoriteShows
              .filter(show => (show.rating || 0) >= 8.0)
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, limit);
          } else {
            // Remover duplicatas e limitar o número de recomendações
            finalRecommendations = recommendedByGenre.reduce((acc, current) => {
              const exists = acc.find(item => item.id === current.id);
              if (!exists) {
                return [...acc, current];
              }
              return acc;
            }, []).slice(0, limit);
          }

          console.log('✅ Recomendações finais:', finalRecommendations.length, finalRecommendations);
          setRecommendations(finalRecommendations);

        } catch (error) {
          console.error('❌ Erro ao gerar recomendações:', error);
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      }, 1000); // Simular delay de rede
    };

    fetchRecommendations();
  }, [favorites, limit, getFavoriteGenres]);

  return {
    recommendations,
    loading,
    hasFavorites: favorites.length > 0,
    favoriteGenres: getFavoriteGenres()
  };
};