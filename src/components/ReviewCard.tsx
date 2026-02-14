import StarRating from "./StarRating";

interface ReviewCardProps {
  nickname?: string;
  rating: number;
  comment?: string;
  amount: number;
  date: string;
}

/** Displays a single customer review/tip */
export default function ReviewCard({
  nickname,
  rating,
  comment,
  amount,
  date,
}: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <span className="font-bold text-dark">
            {nickname || "ناشناس"}
          </span>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      {rating > 0 && (
        <div className="mb-3">
          <StarRating value={rating} readonly size="sm" />
        </div>
      )}

      {comment && (
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {comment}
        </p>
      )}

      <div className="pt-3 border-t border-gray-100">
        <span className="text-primary font-bold">
          {amount.toLocaleString("fa-IR")} تومان
        </span>
      </div>
    </div>
  );
}
