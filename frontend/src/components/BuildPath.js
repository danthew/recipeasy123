exports.buildPath =

function buildPath(route)
    {
    if (process.env.NODE_ENV === 'production')  
    {
        return 'https://recipeasy1234' + '.herokuapp.com/' + route;
    }
    else
    {
        return 'http://localhost:5000/' + route;
    }
}