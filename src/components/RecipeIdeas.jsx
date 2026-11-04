import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'

const API_URL = import.meta.env.VITE_API_URL

export default function RecipeIdeas() {
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecipes() {
      try {
        if (!API_URL) {
          throw new Error('Falta configurar VITE_API_URL en el archivo .env.')
        }

        const response = await axios.get(API_URL, { signal: controller.signal })
        const results = response.data?.meals
        setRecipes(Array.isArray(results) ? results.slice(0, 3) : [])
        setHasError(false)
      } catch (requestError) {
        if (axios.isCancel(requestError) || controller.signal.aborted) return

        setHasError(true)
        await Swal.fire({
          title: 'No pudimos cargar las recetas',
          text: 'Revisá tu conexión e intentá de nuevo en unos minutos.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#28594f',
        })
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadRecipes()
    return () => controller.abort()
  }, [reloadKey])

  function retryRequest() {
    setIsLoading(true)
    setHasError(false)
    setReloadKey((currentKey) => currentKey + 1)
  }

  return (
    <section className="recipe-section" aria-labelledby="recipe-section-title">
      <Container>
        <div className="section-heading">
          <div>
            <p className="eyebrow">INSPIRACIÓN</p>
            <h2 id="recipe-section-title">Ideas para tu próxima comida.</h2>
          </div>
          <p>Descubrí recetas de pollo traídas desde TheMealDB.</p>
        </div>

        {isLoading && (
          <div className="recipe-loading" role="status" aria-live="polite">
            <Spinner animation="border" size="sm" aria-hidden="true" />
            <span>Cargando recetas...</span>
          </div>
        )}

        {!isLoading && hasError && (
          <Alert variant="danger" className="recipe-error">
            <span>No se pudo consultar la API.</span>
            <Button variant="outline-danger" size="sm" onClick={retryRequest}>
              Reintentar
            </Button>
          </Alert>
        )}

        {!isLoading && !hasError && recipes.length === 0 && (
          <p className="recipe-empty">No encontramos recetas para mostrar.</p>
        )}

        {!isLoading && recipes.length > 0 && (
          <Row className="g-3 g-lg-4">
            {recipes.map((recipe) => {
              const recipeUrl = recipe.strSource || recipe.strYoutube

              return (
                <Col key={recipe.idMeal} xs={12} sm={6} lg={4}>
                  <Card className="recipe-card h-100">
                    <Card.Img
                      variant="top"
                      src={recipe.strMealThumb}
                      alt={`Plato de ${recipe.strMeal}`}
                      loading="lazy"
                    />
                    <Card.Body>
                      <Card.Title>{recipe.strMeal}</Card.Title>
                      <Card.Text>
                        {recipe.strArea || 'Internacional'} · {recipe.strCategory || 'Receta'}
                      </Card.Text>
                      {recipeUrl && (
                        <a href={recipeUrl} target="_blank" rel="noreferrer" className="recipe-link">
                          Ver receta <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )}

        <p className="recipe-attribution">
          Recetas e imágenes: <a href="https://www.themealdb.com/api.php" target="_blank" rel="noreferrer">TheMealDB</a>
        </p>
      </Container>
    </section>
  )
}
