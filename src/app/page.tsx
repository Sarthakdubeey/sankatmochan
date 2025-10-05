
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { Alert, ResourceNeed } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { AlertTriangle, Building2, HeartHandshake, Loader2, ShieldCheck, Siren, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { errorEmitter } from '@/lib/firebase/error-emitter';
import { FirestorePermissionError } from '@/lib/firebase/errors';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();
    
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [userSosAlert, setUserSosAlert] = useState<Alert | null>(null);
    const [resourceNeeds, setResourceNeeds] = useState<ResourceNeed[]>([]);
    const [damageReportCount, setDamageReportCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            setLoading(true);

            // Listener for all high-priority alerts (excluding user's own SOS)
            const alertsQuery = query(
                collection(db, 'alerts'),
                where('severity', 'in', ['High', 'Critical']),
                orderBy('timestamp', 'desc'),
                limit(10)
            );
            
            const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
                const fetchedAlerts: Alert[] = [];
                let foundUserSos: Alert | null = null;

                snapshot.forEach(doc => {
                    const alert = { id: doc.id, ...doc.data() } as Alert;
                    // Check if it's the current user's SOS alert
                    if (alert.severity === 'Critical' && alert.createdBy === user.uid) {
                        foundUserSos = alert;
                    } else {
                        fetchedAlerts.push(alert);
                    }
                });

                setAlerts(fetchedAlerts.slice(0, 5)); // Take top 5 non-user alerts
                setUserSosAlert(foundUserSos);
                setError(null);
                setLoading(false);
            }, (err) => {
                console.error(err);
                setError(t('error_failed_to_load_alerts'));
                const permissionError = new FirestorePermissionError({ path: 'alerts', operation: 'list' });
                errorEmitter.emit('permission-error', permissionError);
                setLoading(false);
            });
            
            // Listener for user's specific SOS to ensure it's always captured
            const userSosQuery = query(
                collection(db, 'alerts'),
                where('createdBy', '==', user.uid),
                where('severity', '==', 'Critical'),
                orderBy('timestamp', 'desc'),
                limit(1)
            );

            const unsubscribeUserSos = onSnapshot(userSosQuery, (snapshot) => {
                 if (!snapshot.empty) {
                    const sosAlert = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Alert;
                    setUserSosAlert(sosAlert);
                 } else {
                    // This case handles when an acknowledged SOS is deleted
                    if (userSosAlert) setUserSosAlert(null);
                 }
            });


            // Listener for community requests
            const needsQuery = query(
                collection(db, 'resource_needs'), 
                where('fulfilled', '==', false),
                orderBy('timestamp', 'desc'),
                limit(5)
            );
            const unsubscribeNeeds = onSnapshot(needsQuery, (snapshot) => {
                setResourceNeeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResourceNeed)));
            }, (err) => {
                console.error(err);
                setError(t('error_failed_to_load_community_requests'));
                const permissionError = new FirestorePermissionError({ path: 'resource_needs', operation: 'list' });
                errorEmitter.emit('permission-error', permissionError);
            });
            
            // Listener for damage reports count
            const damageReportsQuery = query(collection(db, 'damage_reports'));
            const unsubscribeDamage = onSnapshot(damageReportsQuery, (snapshot) => {
              setDamageReportCount(snapshot.size);
            });


            return () => {
                unsubscribeAlerts();
                unsubscribeNeeds();
                unsubscribeDamage();
                unsubscribeUserSos();
            };
        }
    }, [user, authLoading, router, t, userSosAlert]);
    
    
    if (authLoading || loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <div className="flex items-center gap-4 text-lg">
                    <Loader2 className="animate-spin h-8 w-8" />
                    <p>{t('nav_dashboard')} is loading...</p>
                </div>
            </div>
        );
    }
    
    const totalHelpRequests = alerts.filter(a => a.severity === 'Critical').length + (userSosAlert ? 1 : 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard_title')}</h1>
            
            {userSosAlert && (
                 <Card className="border-destructive bg-destructive/5">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-destructive">
                         <Siren className="animate-pulse" />
                         {t('dashboard_sos_status_title')}
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       {userSosAlert.acknowledged ? (
                         <div>
                           <p className="text-xl font-bold mb-2">{t('dashboard_sos_status_acknowledged', { status: userSosAlert.rescueStatus || 'Acknowledged' })}</p>
                           <p className="text-muted-foreground">{t('dashboard_sos_status_dispatched_desc')}</p>
                           {userSosAlert.rescueTeam && (
                            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <p className="font-bold text-green-800 dark:text-green-300">{t('dashboard_sos_rescue_team_title', { team: userSosAlert.rescueTeam })}</p>
                                {userSosAlert.eta && <p className="text-sm text-green-700 dark:text-green-400">{t('dashboard_sos_rescue_team_eta', { eta: userSosAlert.eta })}</p>}
                            </div>
                           )}
                         </div>
                       ) : (
                         <div>
                           <p className="text-xl font-bold">{t('dashboard_sos_status_awaiting')}</p>
                           <p className="text-muted-foreground">{t('dashboard_sos_status_awaiting_desc')}</p>
                         </div>
                       )}
                    </CardContent>
                 </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard_total_alerts_title')}</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alerts.length}</div>
                        <p className="text-xs text-muted-foreground">{t('dashboard_total_alerts_desc')}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard_help_requests_title')}</CardTitle>
                        <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalHelpRequests}</div>
                        <p className="text-xs text-muted-foreground">{t('dashboard_help_requests_desc')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard_damage_reports_title')}</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{damageReportCount}</div>
                        <p className="text-xs text-muted-foreground">{t('dashboard_damage_reports_desc')}</p>
                    </CardContent>
                </Card>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard_live_alerts_title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && <p className="text-destructive text-center py-4">{error}</p>}
                        {!error && alerts.length === 0 ? (
                             <div className="text-center text-muted-foreground py-8">
                                <ShieldCheck className="mx-auto h-12 w-12" />
                                <p className="mt-4 font-semibold">{t('dashboard_all_clear_title')}</p>
                                <p className="text-sm">{t('dashboard_all_clear_desc')}</p>
                             </div>
                        ) : (
                            <ul className="space-y-4">
                                {alerts.map(alert => (
                                    <li key={alert.id} className="flex items-start gap-4">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{alert.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{alert.description}</p>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {t('dashboard_time_ago', { time: formatDistanceToNow(alert.timestamp.toDate()) })}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>{t('dashboard_community_needs_title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {resourceNeeds.length === 0 ? (
                              <div className="text-center text-muted-foreground py-8">
                                <p>{t('dashboard_no_help_requests')}</p>
                                <Button variant="link" asChild><Link href="/resource-locator">{t('nav_resource_locator')}</Link></Button>
                             </div>
                        ) : (
                             <ul className="space-y-4">
                                {resourceNeeds.map(need => (
                                    <li key={need.id} className="flex items-start gap-4">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{need.quantity}x {need.item}</h3>
                                            <p className="text-sm text-muted-foreground">Urgency: <Badge variant={need.urgency === 'High' ? 'destructive' : 'secondary'}>{need.urgency}</Badge></p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    