import { MongoClient, ObjectId } from 'mongodb';

// Replace with your MongoDB connection string from Vercel environment variables
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, { }); // Remove the options object

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDB(); // Call this function to establish connection

export default async function handler(req, res) {
  const db = client.db("your_database_name"); // Replace with your database name
  const notesCollection = db.collection("notes");

  if (req.method === 'GET') {
    try {
      const notes = await notesCollection.find().toArray();
      return res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }
  } else if (req.method === 'POST') {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ error: "Please provide note content" });
    }

    try {
      const newNote = {
        content: note,
        timestamp: new Date().toISOString(),
      };
      const result = await notesCollection.insertOne(newNote);
      return res.status(201).json({ ...newNote, id: result.insertedId });  // Send actual ObjectId
    } catch (error) {
      console.error("Error saving note:", error);
      return res.status(500).json({ error: "Failed to save note" });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Please provide a note ID" });
    }

    console.log("Received ID:", id); // Log for debugging

    try {
      const result = await notesCollection.deleteOne({ _id: new ObjectId(id) }); // Use actual ObjectId
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting note:", error);
      return res.status(500).json({ error: "Failed to delete note" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
