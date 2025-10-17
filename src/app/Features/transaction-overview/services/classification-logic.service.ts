import { Injectable } from '@angular/core';
import { Transaction } from '@shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ClassificationLogicService {
    /**
     * Classifies a list of transactions based on keyword matching in the description and recipient fields.
     * Only transactions with classificationSource === 0 (unclassified) will be modified.
     *
     * @param transactions - The list of transactions to classify.
     * @param classificationCategories - A map of categories to their associated list of keywords.
     * @returns The updated list of transactions (sorted/filtered as needed).
     */
    classify(transactions: Transaction[], classificationCategories: Record<string, string[]>): Transaction[] {
        return transactions.map(tx => {
            if (tx.classificationSource !== 0) return tx; //guard clause for already classified
            const matchedCategory = this.matchCategory(`${tx.description} ${tx.recipient}`, classificationCategories);
            if (matchedCategory) {
                return {
                    ...tx,
                    category: matchedCategory,
                    classificationSource: 2 // 2 = rule-based
                };
            }
            return tx;
        });
    }
  
    /**
     * Attempts to match a given text to a category based on provided classification tags.
     * 
     * @param text - The combined description and recipient string to evaluate.
     * @param categories - A key-value map where each category is associated with a list of tags.
     * @returns The matched category name, or null if no match is found.
     */
    private matchCategory(text: string, categories: Record<string, string[]>): string | null {
        const lowerText = text.toLowerCase();
        
        for (const [category, tags] of Object.entries(categories)) {
            for (const tag of tags) {
                if (lowerText.includes(tag.toLowerCase())) {
                return category;
                }
            }
        }
        return null;
    }
}