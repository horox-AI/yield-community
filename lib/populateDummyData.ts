import dbConnect from '../lib/dbConnect'; 
import Post from '../utils/models/post'; 
import mongoose from 'mongoose';

const dummyPosts = [
  {
    title: "First Post",
    content: "This is the content of the first post.",
    author: "Author Name",
    date: new Date(),
    votes: 0,
    comments: 0,
    authorImage: "https://example.com/image.jpg",
    commenters: []
  },
  // Add more dummy posts as needed
];

const populateDummyData = async () => {
  await dbConnect();

  try {
    // Insert dummy data
    await Post.insertMany(dummyPosts);
    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Failed to insert dummy data:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }

};

populateDummyData();
