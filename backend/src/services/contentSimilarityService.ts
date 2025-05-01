import pkg from 'natural';
import { removeStopwords } from 'stopword';

const { TfIdf, WordTokenizer, PorterStemmer } = pkg;

interface IPost {
    id: string;
    title: string;
    content: string;
}

class ContentSimilarityService {
    private tokenizer;
    private stemmer = PorterStemmer;

    constructor() {
        this.tokenizer = new WordTokenizer();
    }

    private processText(text: string): string[] {
        const lowerText = text.toLowerCase();
        
        const tokens = this.tokenizer.tokenize(lowerText) || [];
    
        const filteredTokens = removeStopwords(tokens);

        return filteredTokens.map(token => this.stemmer.stem(token));
    }

    async findSimilarPosts(targetPost: IPost, candidatePosts: IPost[], count: number = 5): Promise<{ post: IPost; score: number }[]> {
        const tfidf = new TfIdf();
        
        // Add target post content
        const targetContent = `${targetPost.title} ${targetPost.content}`;
        const processedTarget = this.processText(targetContent).join(' ');
        tfidf.addDocument(processedTarget);
        
        // Add all candidate posts
        const candidates = candidatePosts.filter(post => post.id !== targetPost.id);
        candidates.forEach(post => {
          const content = `${post.title} ${post.content}`;
          const processedContent = this.processText(content).join(' ');
          tfidf.addDocument(processedContent);
        });
        
        // Calculate similarities
        const similarities = [];
        for (let i = 0; i < candidates.length; i++) {
          let similarity = 0;
          
          // Compare terms in the target document
          tfidf.listTerms(0).forEach(term => {
            // Get term frequency in target document
            const targetTf = term.tfidf;
            
            // Get term frequency in candidate document
            tfidf.tfidfs(term.term, (docIndex, measure) => {
              if (docIndex === i + 1) { // +1 because target is at index 0
                similarity += targetTf * measure;
              }
            });
          });
          
          similarities.push({
            post: candidates[i],
            score: similarity,
          });
        }
        
        // Sort by similarity score and return top results
        return similarities
          .sort((a, b) => b.score - a.score)
          .slice(0, count)
      }
}

export default new ContentSimilarityService();