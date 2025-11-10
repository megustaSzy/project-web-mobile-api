import app from "./src/index";

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running in port http://localhost:${PORT}`)
})