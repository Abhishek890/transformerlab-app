import { Grid, Sheet } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import RecipeCard from './RecipeCard';

export default function ListRecipes({ recipeDetails, setSelectedRecipe }) {
  return (
    <>
      <Typography level="h2">👋 Welcome to Transformer Lab!</Typography>
      <Typography level="h3" mb={1}>
        What do you want to do?
      </Typography>
      <Sheet
        variant="soft"
        color="neutral"
        sx={{
          width: '100%',
          height: '100%',
          p: 2,
          overflowY: 'auto',
          borderRadius: 'md',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            justifyContent: 'flext-start',
            alignContent: 'flex-start',
            overflow: 'auto',
            maxWidth: '1000px' /* Adjust this to your desired max width */,
            margin: '0 auto',
          }}
        >
          <Grid key={-1} sx={{ width: '250px' }}>
            <RecipeCard
              recipeDetails={{
                id: -1,
                title: 'Create an Empty Experiment',
                description: 'Start from scratch',
                cardImage:
                  'https://images.unsplash.com/photo-1559311648-d46f5d8593d6?auto=format&fit=crop&w=318',
              }}
              setSelectedRecipe={setSelectedRecipe}
            />
          </Grid>
          {recipeDetails.map((recipe) => (
            <Grid key={recipe.id} sx={{ width: '250px' }}>
              <RecipeCard
                recipeDetails={recipe}
                setSelectedRecipe={setSelectedRecipe}
              />
            </Grid>
          ))}
        </Grid>
      </Sheet>
    </>
  );
}
