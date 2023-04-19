# USING API's
## Using Express - PostgreSQL middleware
HTTP (HyperText Transfer Protocol) is a protocol that governs the transfer of data over the web. It is a standard protocol that allows clients (web browsers, apps, or any other program that requests data) to request and receive data from servers (web servers, APIs, or any other program that provides data).

Each HTTP request is made up of a method, a URL, and headers that provide additional information about the request.

db.js includes the login infromation for the PostgreSQL Database

ALWAYS use a try and catch in you code

### Get
This method is used to retrieve information from the server. When a client sends an HTTP GET request, it is asking the server to return a resource, such as a web page, an image, or a file, that matches the specified URL. The request is made without modifying any of the server's data, and the response typically includes a representation of the requested resource.

We will be using get to obtain information from the database. Think of Selects, for example:
```Javascript
app.get("/menu", async (req,res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM menu");
        res.json(allTodos.rows)
    }
    catch (err){
        console.error(err.message);
    }
});
```

### Post
HTTP POST: This method is used to send data to the server. When a client sends an HTTP POST request, it is asking the server to accept and store data that the client is sending. The data is typically sent in the form of key-value pairs, such as form data, JSON data, or XML data. The server can then use this data to perform an action, such as creating a new resource or updating an existing one.

Post are used to add things to the database. for example:
```Javascript
// create a todo
app.post("/todo", async(req,res) => {
    try{
        //await
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", 
        [description]
        );
        res.json(newTodo.rows[0]);
    }
    catch (err){
        console.error(err.message);
    }
});
```

### Put
HTTP PUT: This method is used to update an existing resource on the server. When a client sends an HTTP PUT request, it is asking the server to replace the existing resource with the one sent in the request. The request typically includes the entire updated resource, and any missing fields are assumed to be deleted. If the resource does not exist, the server may create it.

We will use this to update things in the database. Be carful with puts though and do further research on them
```javascript
// update a todo
app.put("/todo/:id", async (req,res) => {
    try{
        const { id } = req.params; // WHERE
        const { description } = req.body; // SET
         const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2", 
            [description,id]
         );

         res.json("Todo was updated!")
    }
    catch (err){
         console.log(err.message);
    }
});
```

### Delete
HTTP DELETE: This method is used to delete a resource on the server. When a client sends an HTTP DELETE request, it is asking the server to remove the specified resource from the server. The server may also respond with a confirmation message to indicate that the resource has been deleted.

```Javascript
app.delete("/todo/:id", async (req,res) => {
    try{
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was successfully deleted!");
    }
    catch (err){
        console.log(err.message);
    }
});

```
