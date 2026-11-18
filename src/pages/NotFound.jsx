import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";

export default function NotFound() {
  return (
    <Card>
      <EmptyState emoji="🦋" title="This page flew away" description="We couldn’t find what you were looking for.">
        <Button asChild>
          <Link to="/">Back to dashboard</Link>
        </Button>
      </EmptyState>
    </Card>
  );
}
