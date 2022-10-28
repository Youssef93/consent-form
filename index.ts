import app from './src/app'

const port = process.env.PORT || 3000

app.listen(port, () => console.info(`App listening on port ${port}!`))
