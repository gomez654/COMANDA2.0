import HeroSection from '../components/HeroSection'
import RecipeIdeas from '../components/RecipeIdeas'

export default function HomePage({ productCount }) {
  return (
    <>
      <HeroSection productCount={productCount} />
      <RecipeIdeas />
    </>
  )
}
