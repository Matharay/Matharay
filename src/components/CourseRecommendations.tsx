import { BookOpen, Lock } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Course } from "@/lib/courseData";

interface Props {
  courses: Course[];
}

const CourseRecommendations = ({ courses }: Props) => {
  const { t, language } = useApp();

  if (courses.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t.recommendedCourses}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 opacity-50 cursor-not-allowed select-none"
          >
            <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground font-medium">
              {course.title[language as "en" | "es"] ?? course.title.en}
            </span>
            <span className="ml-auto text-xs text-muted-foreground/70 italic">
              {t.coursesComingSoon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations;
