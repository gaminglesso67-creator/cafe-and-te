'use client';

import React, { useState } from 'react';
import { getStore } from '@/lib/db';
import { ReviewSlot } from '@/lib/seed-data';
import { PermissionGuard } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  RatingStars,
  TextareaInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Review Moderation & Manual Review Add (`/admin/reviews`, PRD 6.2, 7.5 & 9.5):
 * Guarded by `reviews:moderate` (Manager & Owner).
 */
export default function AdminReviewsPage() {
  const store = getStore();
  const { notify } = useToast();
  const [reviews, setReviews] = useState<ReviewSlot[]>([...store.reviews]);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');

  const handleAddManualReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;
    const created: ReviewSlot = {
      id: `rev-${Date.now()}`,
      reviewerName,
      rating: 5,
      comment,
      dateLabel: '{{MANUAL_DATE_TOKEN}}',
      source: 'MANUAL',
      isPublished: true,
    };
    const updated = [created, ...reviews];
    store.reviews = updated;
    setReviews(updated);
    setReviewerName('');
    setComment('');
    notify('{{MANUAL_REVIEW_ADDED}}', 'success');
  };

  const togglePublish = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, isPublished: !r.isPublished } : r
    );
    store.reviews = updated;
    setReviews(updated);
    notify('{{REVIEW_VISIBILITY_TOGGLED}}', 'info');
  };

  return (
    <PermissionGuard capability="reviews:moderate">
      <div className="space-y-6">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{REVIEW_MODERATION_HEADING}}'}</h1>
        </div>

        <Card variant="surface">
          <form onSubmit={handleAddManualReview} className="space-y-3">
            <h2 className="font-serif text-xl text-gold">{'{{ADD_MANUAL_REVIEW_HEADING}}'}</h2>
            <TextInput
              id="manual-reviewer-name"
              label={'{{FIELD_REVIEWER_NAME}}'}
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
            <TextareaInput
              id="manual-reviewer-comment"
              label={'{{FIELD_REVIEW_COMMENT}}'}
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" variant="primary" size="sm">
              + {'{{PUBLISH_MANUAL_REVIEW}}'}
            </Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <Card key={r.id} variant="surface" className="space-y-3">
              <div className="flex items-center justify-between">
                <RatingStars rating={r.rating} />
                <Badge kind="neutral" label={r.source} />
              </div>
              <p className="text-sm text-text italic">&ldquo;{r.comment}&rdquo;</p>
              <div className="flex items-center justify-between pt-2 border-t border-gold/15 text-xs">
                <span className="text-muted">{r.reviewerName}</span>
                <Button variant="secondary" size="sm" onClick={() => togglePublish(r.id)}>
                  {r.isPublished ? '{{PUBLISHED_CLICK_TO_HIDE}}' : '{{HIDDEN_CLICK_TO_PUBLISH}}'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
}

