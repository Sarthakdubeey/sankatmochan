
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Landmark, CloudRain, Wind, Waves, Landslide, AlertTriangle, Info } from "lucide-react";
import { advisories as allAdvisories } from '@/lib/data';
import type { GovernmentAdvisory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const agencyIcons: { [key: string]: React.ElementType } = {
  "National Disaster Management Authority (NDMA)": Landmark,
  "India Meteorological Department (IMD)": CloudRain,
};

const severityIcons: { [key: string]: React.ElementType } = {
  Warning: AlertTriangle,
  Watch: Info,
  Advisory: Info,
};

const severityColors: { [key: string]: string } = {
  Warning: 'border-destructive bg-destructive/10 text-destructive-foreground',
  Watch: 'border-yellow-500 bg-yellow-500/10 text-yellow-600',
  Advisory: 'border-primary bg-primary/10 text-primary',
};


export default function AdvisoriesPage() {
  const [advisories, setAdvisories] = useState<GovernmentAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'NDMA' | 'IMD'>('all');

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      const filteredAdvisories = allAdvisories.filter(adv => {
        if (filter === 'all') return true;
        if (filter === 'NDMA') return adv.agency === "National Disaster Management Authority (NDMA)";
        if (filter === 'IMD') return adv.agency === "India Meteorological Department (IMD)";
        return false;
      });
      setAdvisories(filteredAdvisories);
      setLoading(false);
    }, 500);
  }, [filter]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Government Advisories</h1>
        <p className="text-muted-foreground">
          Real-time alerts and preparedness information from official agencies.
        </p>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All Sources</Button>
        <Button variant={filter === 'NDMA' ? 'default' : 'outline'} onClick={() => setFilter('NDMA')}>
            <Landmark className="mr-2 h-4 w-4"/>
            NDMA
        </Button>
        <Button variant={filter === 'IMD' ? 'default' : 'outline'} onClick={() => setFilter('IMD')}>
            <CloudRain className="mr-2 h-4 w-4"/>
            IMD
        </Button>
      </div>

      <div className="space-y-6">
        {loading ? (
            [...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-72" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                            <Skeleton className="h-12 w-12 rounded-lg" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))
        ) : advisories.length > 0 ? (
          advisories.map((advisory) => {
            const AgencyIcon = agencyIcons[advisory.agency] || Landmark;
            const SeverityIcon = severityIcons[advisory.severity] || Info;

            return (
              <Card key={advisory.id} className={cn('border-l-4', severityColors[advisory.severity]?.split(' ')[0].replace('bg-','border-'))}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                        <CardTitle>{advisory.title}</CardTitle>
                        <CardDescription>
                          Issued by: {advisory.agency} on {advisory.date}
                        </CardDescription>
                    </div>
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", severityColors[advisory.severity]?.split(' ')[1])}>
                        <AgencyIcon className={cn("h-6 w-6", severityColors[advisory.severity]?.split(' ')[2])} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/90">{advisory.summary}</p>
                   <div className="flex items-center gap-2">
                        <Badge variant={advisory.severity === 'Warning' ? 'destructive' : 'secondary'} className="capitalize">{advisory.severity}</Badge>
                        <Badge variant="outline" className="capitalize">{advisory.type}</Badge>
                   </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
            <Card className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">No advisories found for the selected source.</p>
            </Card>
        )}
      </div>
    </div>
  );
}
