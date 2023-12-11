import * as tf from "@tensorflow/tfjs-node";
import { TfIdf, WordTokenizer } from "natural";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// const saveModel = async (model: tf.Sequential) => {
//   const uploadsDir = "trained_model";

//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//   }
//   await model
//     .save(`file://./${uploadsDir}`)
//     .then(() => {
//       console.log("Model saved to", `${uploadsDir}`);
//     })
//     .catch((saveErr) => {
//       console.error("Error saving model:", saveErr);
//     });
// };

// // Step 1: Prepare data (replace with your data)
// interface Item {
//   _id: string;
//   name: string;
// }

// const itemData: any = [
//   {
//     _id: "65768f1ef9bdba6e84edfc19",
//     user: "65768f1ef9bdba6e84edfc15",
//     name: "CLASSIC MESH ONYX . ",
//     image: "/image/watch.jpg",
//     brand: "Daniel wellington ",
//     category: "Watch",
//     description:
//       "With the Classic Mesh Onyx, great has just become even better. Our signature timepiece gets a new dial color with a sunray finish for a sophisticated look. The mesh bracelet adds texture and brilliance to the watch, daring us to discover complexity even in a minimalist piece. Moreso, the interchangeable strap makes this watch versatile and utterly timeless. A second strap can turn your timepiece into an entirely new watch!",
//     rating: 3,
//     numReviews: 0,
//     price: 279,
//     countInStock: 10,
//     reviews: [],
//     __v: 0,
//     createdAt: "2023-12-11T04:25:02.616Z",
//     updatedAt: "2023-12-11T04:25:02.616Z",
//   },
//   {
//     _id: "65768f1ef9bdba6e84edfc1a",
//     user: "65768f1ef9bdba6e84edfc15",
//     name: "TOTE BAG WITH COMPARTMENTS CLASSIC",
//     image: "/image/handbag.jpg",
//     brand: "ZARA",
//     category: "Handbag",
//     description: "OUTER SHELL: 100% polyurethane",
//     rating: 4,
//     numReviews: 0,
//     price: 899.99,
//     countInStock: 7,
//     reviews: [],
//     __v: 0,
//     createdAt: "2023-12-11T04:25:02.616Z",
//     updatedAt: "2023-12-11T04:25:02.616Z",
//   },
//   {
//     _id: "65768f1ef9bdba6e84edfc1b",
//     user: "65768f1ef9bdba6e84edfc15",
//     name: "MINIMALIST SHOULDER BAG",
//     image: "/image/shoulderbag.jpg",
//     brand: "ZARA",
//     category: "Handbag",
//     description: "100% polyurethane",
//     rating: 4,
//     numReviews: 0,
//     price: 899.99,
//     countInStock: 7,
//     reviews: [],
//     __v: 0,
//     createdAt: "2023-12-11T04:25:02.617Z",
//     updatedAt: "2023-12-11T04:25:02.617Z",
//   },
//   {
//     _id: "65768f1ef9bdba6e84edfc1c",
//     user: "65768f1ef9bdba6e84edfc15",
//     name: "BACKPACK WITH FOLDOVER FLAP",
//     image: "/image/backbag.jpg",
//     brand: "ZARA",
//     category: "BAG",
//     description:
//       "Backpack featuring outside pockets, top carry handle and adjustable shoulder straps. Gathered and magnetic clasp closure.",
//     rating: 4,
//     numReviews: 0,
//     price: 499.99,
//     countInStock: 7,
//     reviews: [],
//     __v: 0,
//     createdAt: "2023-12-11T04:25:02.617Z",
//     updatedAt: "2023-12-11T04:25:02.617Z",
//   },
// ];

class Recommend {
  private tfidfVectors: number[][];
  private similarityMatrix: number[][];

  constructor(private itemData: any[], private idItem: any) {
    this.tfidfVectors = this.createTfidfVectors(itemData);
    console.log(this.tfidfVectors);
    this.similarityMatrix = this.createSimilarityMatrix(this.tfidfVectors);
  }

  private findIndexItem(idItem: any): number {
    const indexItem = this.itemData.findIndex(
      (item) => item._id == this.idItem
    );
    return indexItem;
  }

  private createTfidfVectors(itemData: any[]): number[][] {
    const tfidf = new TfIdf();
    const tokenizer = new WordTokenizer();

    const indexItem = this.findIndexItem(this.idItem);

    console.log("Keywords");
    const listOfKeyword: any = [];
    itemData.forEach((item) => tfidf.addDocument(item.name));
    const vocabulary = tfidf.listTerms(indexItem).map((term) => {
      listOfKeyword.push(term.term);
      return term.term;
    });
    console.log(listOfKeyword);

    return itemData.map((item) => {
      const words: any = tokenizer.tokenize(item.name.toLowerCase());
      return vocabulary.map((term) => (words.includes(term) ? 1 : 0));
    });
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, value) => sum + value ** 2, 0)
    );
    return vector.map((value) => value / magnitude);
  }

  private cosineDistance(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce(
      (sum, value, index) => sum + value * vectorB[index],
      0
    );
    const magnitudeA = Math.sqrt(
      vectorA.reduce((sum, value) => sum + value ** 2, 0)
    );
    const magnitudeB = Math.sqrt(
      vectorB.reduce((sum, value) => sum + value ** 2, 0)
    );
    return 1 - dotProduct / (magnitudeA * magnitudeB);
  }

  private createSimilarityMatrix(tfidfVectors: number[][]): number[][] {
    return tfidfVectors.map((vectorA, i) =>
      tfidfVectors.map((vectorB, j) =>
        this.cosineDistance(
          this.normalizeVector(vectorA),
          this.normalizeVector(vectorB)
        )
      )
    );
  }

  recommendItems(targetItemId: any): number[] | null {
    const targetItemIndex = this.findIndexItem(targetItemId);
    if (targetItemIndex !== -1) {
      const targetSimilarities = this.similarityMatrix[targetItemIndex];

      console.log(targetSimilarities);
      const sortedItems = targetSimilarities
        .map((similarity, index) => ({
          id: this.itemData[index]._id,
          similarity,
        }))
        .filter((entry) => !isNaN(entry.similarity))
        .sort((a, b) => a.similarity - b.similarity) // Sort in ascending order
        .map((entry) => entry.id)
        .slice(0, 4);
      return sortedItems;
    } else {
      console.error(`Item with ID ${targetItemId} not found.`);
      return null;
    }
  }
}

export default Recommend;

// Example usage:
// const targetItemId = "65768f1ef9bdba6e84edfc19";
// const recommend = new Recommend(itemData, targetItemId);
// const topSimilarItems = recommend.recommendItems(targetItemId);

// if (topSimilarItems) {
//   console.log(`Top similar items for Item ${targetItemId}:`, topSimilarItems);
// }
