import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Container } from 'react-bootstrap'

const API_URL = import.meta.env.VITE_API_URL

export default function RecipeSuggestion() {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadRecipe() {
      try {
        if (!API_URL) {
          throw new Error('No se configuró VITE_API_URL en el archivo .env.')
        }

        const response = await axios.get(API_URL)
        const result = response.data?.meals?.[0]

        if (!result) {
          throw new Error('La API no devolvió una receta para mostrar.')
        }

        if (isCurrent) setRecipe(result)
      } catch (requestError) {
        if (!isCurrent) return

        const message = requestError instanceof Error
          ? requestError.message
          : 'Ocurrió un error inesperado al consultar la API.'
        setError(message)
        await Swal.fire({
          icon: 'error',
          title: 'No pudimos cargar la receta',
          text: message,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#28594f',
        })
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    loadRecipe()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <section className="recipe-section" aria-labelledby="recipe-title">
      <Container>
        <div className="recipe-heading">
          <p className="eyebrow">INSPIRACIÓN GASTRONÓMICA</p>
          <h2 id="recipe-title">Una idea para tu próxima comida</h2>
          <p>Descubrí una receta internacional con datos de TheMealDB.</p>
        </div>

        {loading && (
          <p className="recipe-status" role="status" aria-live="polite">
            Cargando una receta...
          </p>
        )}

        {!loading && error && (
          <p className="recipe-status recipe-error" role="alert">
            No se pudo mostrar la receta. {error}
          </p>
        )}

        {!loading && recipe && (
          <article className="recipe-card">
            <img
              className="recipe-image"
              src={recipe.strMealThumb}
              alt={`Plato de ${recipe.strMeal}`}
            />
            <div className="recipe-details">
              <div>
                <h3>{recipe.strMeal}</h3>
                {(recipe.strCategory || recipe.strArea) && (
                  <p className="recipe-meta">
                    {[recipe.strCategory, recipe.strArea].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              {recipe.strInstructions && (
                <p className="recipe-instructions">{recipe.strInstructions}</p>
              )}
              {recipe.strSource && (
                <a href={recipe.strSource} target="_blank" rel="noreferrer">
                  Ver receta completa
                </a>
              )}
            </div>
          </article>
        )}
      </Container>
    </section>
  )
}
