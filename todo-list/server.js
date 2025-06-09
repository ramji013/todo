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
  title: {
    type: String,
    required: true,
  },
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
    res.status(500).json({ error: error.message })
  }
})

//get all todo items
app.get("/todos", async (req, res) => {
  try {
    todoModel.find().then((todos) => {
      res.json(todos)
    })
  } catch (error) {
    console.error("Error fetching todos:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    )
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" })
    }
    res.json(updatedTodo)
  } catch (error) {
    console.error("Error updating todo:", error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
})
