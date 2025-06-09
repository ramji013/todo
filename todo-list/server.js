const express = require("express")
const mongoose = require("mongoose")
const app = express()
app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies
const port = 3000

let todos = []

mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
})

const todoModel = mongoose.model("Todo", todoSchema)

//create a new todo item
app.post("/todos", async (req, res) => {
  const { description, title } = req.body

  try {
    const model = new todoModel({ title, description })
    await model.save()
    // Return the saved model
    res.status(201).json(model)
  } catch (error) {
    console.error("Error saving todo:", error)
    res.status(500).json({ error: "Failed to save todo" })
  }
})

//get all todo items
app.get("/todos", (req, res) => {
  res.json(todos)
})

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
})
