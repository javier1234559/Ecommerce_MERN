import * as tf from "@tensorflow/tfjs-node";
import { TfIdf } from 'natural';
import { IProduct } from "../models/productModel";
import dotenv from "dotenv";
import Product from "../models/productModel";
import connectDB from "../config/database";
import fs from "fs";
import path from "path";

dotenv.config();

// connectDB();

// class Recommend {
//   savedModelPath: string;
//   data: IProduct[];
//   similarityMatrix: any;
//   tfidfMatrix: any;
//   xs: tf.Tensor2D | undefined;
//   ys: tf.Tensor2D | undefined;

//   constructor(savedPath: string, data: IProduct[] | any) {
//     this.savedModelPath = savedPath;
//     this.data = data;
//   }

//   cleanData = (): any => {
//     const tokenizer = new natural.WordTokenizer();
//     const cleanedData: any = this.data.map((item: IProduct) => ({
//       id: item.id,
//       tokens: tokenizer.tokenize(item.description.toLowerCase()),
//     }));

//     return cleanedData;
//   };

//   // // Step 3: TF-IDF Vectorization
//   vectorization = (): any => {
//     const tfidf = new natural.TfIdf();

//     const cleanedData = this.cleanData();
//     cleanedData.forEach((item: any) => {
//       tfidf.addDocument(item.tokens);
//     });
//     const tfidfMatrix: number[][] = cleanedData.map((item: any, index: any) => {
//       const vector = Array.from(tfidf.listTerms(index)).map(
//         (term) => term.tfidf
//       );
//       return vector;
//     });
//     this.tfidfMatrix = tfidfMatrix;
//   };

//   buildModel = (): any => {
//     // Step 4: Build a Similarity Matrix
//     this.similarityMatrix = tf
//       .tensor2d(this.tfidfMatrix)
//       .matMul(tf.tensor2d(this.tfidfMatrix), true, false);

//     // Step 5: Build and Train the Model
//     const model: tf.Sequential = tf.sequential({
//       layers: [
//         tf.layers.dense({
//           inputShape: [this.data.length],
//           units: this.data.length,
//           activation: "softmax",
//         }),
//       ],
//       // optimizer: "adam",
//       loss: "meanSquaredError",
//     });
//   };

//   trainModel = (): any => {

//   };

//   saveModel = (): any => {};

//   getRecommendList = (): any => {};
// }

// export default Recommend;

// const testTrain = async () => {
//   const savedPath = "";
//   const listProduct: any = await Product.find();
//   const recommend = new Recommend(savedPath, listProduct);

//   console.log(recommend.data);
// };

// testTrain();

const saveModel = async (model: tf.Sequential) => {
  const uploadsDir = "trained_model";

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  await model
    .save(`file://./${uploadsDir}`)
    .then(() => {
      console.log("Model saved to", `${uploadsDir}`);
    })
    .catch((saveErr) => {
      console.error("Error saving model:", saveErr);
    });
};

// Step 1: Prepare data (replace with your data)
interface Item {
  id: number;
  text: string;
}

const itemData: Item[] = [
  {
    id: 1,
    text: "This is a shoes for item 1 world description. It is a great item with many features.",
  },
  {
    id: 2,
    text: "Item 2 is another fantastic item world shoes. It has different features from item 1.",
  },
  {
    id: 3,
    text: "The third item is the best yet! It combines features from item 1 and 2.",
  },
  { id: 4, text: "Item 4 is a unique item with its own set of features." },
  {
    id: 5,
    text: "This is a description for item 5 world shoes. It is similar to item 1 but has additional features.",
  },
  { id: 6, text: "Item 6 is a versatile item with a wide range of uses." },
  {
    id: 7,
    text: "The seventh item is a high-quality item with premium features.",
  },
  {
    id: 8,
    text: "Item 8 is a budget-friendly item with great value for its price.",
  },
  {
    id: 9,
    text: "This is a description for item 9. It is a durable and long-lasting item.",
  },
  {
    id: 10,
    text: "Item 10 is the final item in this list. It has the best features of all previous items.",
  },
];
// Create a TF-IDF instance
const tfidf = new TfIdf();

// Add documents to the TF-IDF instance
itemData.forEach(item => {
  tfidf.addDocument(item.text);
});

// Create a vocabulary
const vocabulary = tfidf.listTerms(0).map(term => {
  console.log(term);
  return term.term
});

// Function to convert a document to TF-IDF vector
function documentToTfIdfVector(document: string): number[] {
  const words = document.split(' ');
  return vocabulary.map(term => (words.includes(term) ? 1 : 0));
}

// Create TF-IDF vectors for each item
const tfidfVectors = itemData.map(item => documentToTfIdfVector(item.text));

// Function to normalize a vector
function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return vector.map(value => value / magnitude);
}

// Function to calculate dot product between two vectors
function dotProduct(vectorA: number[], vectorB: number[]): number {
  return vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
}

function magnitude(vector: any[]) {
  return Math.sqrt(vector.reduce((sum: number, value: number) => sum + value * value, 0));
 }

 function cosineSimilarity(vectorA: any[], vectorB: any[]) {
  return dotProduct(vectorA, vectorB) / (magnitude(vectorA) * magnitude(vectorB));
 }

// Function to calculate cosine distance between two vectors
function cosineDistance(vectorA: number[], vectorB: number[]): number {
  const dotProductAB = dotProduct(vectorA, vectorB);
  return 1 - cosineSimilarity(vectorA, vectorB);
}

// Create a similarity matrix
const similarityMatrix: number[][] = [];

for (let i = 0; i < itemData.length; i++) {
  similarityMatrix[i] = [];
  for (let j = 0; j < itemData.length; j++) {
    const distance = cosineDistance(normalizeVector(tfidfVectors[i]), normalizeVector(tfidfVectors[j]));
    similarityMatrix[i][j] = distance;
  }
}

console.log(normalizeVector(tfidfVectors[0]));
console.log(normalizeVector(tfidfVectors[0]));
const distance = cosineDistance(normalizeVector(tfidfVectors[0]), normalizeVector(tfidfVectors[0]));
console.log(distance);


const trainModel = ()=>{
  
}

console.log('TF-IDF Vectors:', tfidfVectors);
// console.log('Cosine Similarity Matrix:', similarityMatrix);

// Choose a target item (e.g., item with ID 1)
const targetItemId = 1;

// Find the index of the target item in itemData
const targetItemIndex = itemData.findIndex(item => item.id === targetItemId);

if (targetItemIndex !== -1) {
  // Get the similarity scores for the target item
  const targetSimilarities = similarityMatrix[targetItemIndex];

  // Sort items by similarity in ascending order
  const sortedIndices = targetSimilarities
    .map((similarity, index) => ({ index, similarity }))
    .sort((a, b) => a.similarity - b.similarity)
    .map(entry => entry.index);

    console.log(targetSimilarities)
    console.log(sortedIndices)
    
  // Print top N similar items
  const topSimilarItems = sortedIndices.map(index => itemData[index].id); // Exclude the target item itself
  console.log(`Top similar items for Item ${targetItemId}:`, topSimilarItems);
} else {
  console.error(`Item with ID ${targetItemId} not found.`);
}

// async function test() {
//   // await trainModel();
//   // Example Inference
//   // await getRecommendations(1);
// }

// test();
