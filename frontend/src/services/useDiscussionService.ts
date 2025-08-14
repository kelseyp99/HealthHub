import { useState } from 'react';

export interface Discussion {
  title: string;
  id: number;
}

export function useDiscussionService() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const fetchDiscussions = () => {
    // Fake API fetch
    setTimeout(() => {
      setDiscussions([
        { id: 1, title: 'Nutrition Q&A' },
        { id: 2, title: 'Meal Prep Tips' }
      ]);
    }, 500);
  };

  return {
    discussions,
    fetchDiscussions
  };
}
