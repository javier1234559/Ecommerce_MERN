// import * as tf from "@tensorflow/tfjs-node";
import { TfIdf, WordTokenizer } from "natural";

class Recommend {
  private tfidfVectors: number[][];
  private similarityMatrix: number[][];

  constructor(private itemData: any[], private idItem: any) {
    this.tfidfVectors = this.createTfidfVectors(itemData);
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

    console.log("Keywords is :");
    itemData.forEach((item) => tfidf.addDocument(item.name));
    const vocabulary = tfidf.listTerms(indexItem).map((term) => {
      return term.term;
    });

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

      const sortedItems = targetSimilarities
        .map((similarity, index) => ({
          id: this.itemData[index]._id,
          similarity,
        }))
        .filter((entry) => !isNaN(entry.similarity))
        .sort((a, b) => a.similarity - b.similarity)
        .map((entry) => entry.id)
        .slice(0, 4);

      console.log(`List id recommend: ${sortedItems}`);
      return sortedItems;
    } else {
      console.error(`Item with ID ${targetItemId} not found.`);
      return null;
    }
  }
}

export default Recommend;
