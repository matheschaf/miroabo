const publicVapidKey='BCm1tKjCO0dTBHsc4Hrcxh_ZY5oszla0Ekmoqyrev2A8ZI1RQXC_ZvOozooVeW5HUlYtBGuBrzaqSl5rP2dhL_s';
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/serviceWorker.js', {
                scope: '/'
            }).then(register => {
                try{document.getElementById('subscribe').addEventListener('click', () => subscribeUser(register));
                document.getElementById('unsubscribe').addEventListener('click', () => unsubscribeUser(register));
                document.getElementById('sendNotification').addEventListener('click', () => sendPushNotification(register));}catch{}
            }).catch(err => console.error(err));
        }

        async function subscribeUser(register) {
            console.log('Abonniere Push-Benachrichtigungen...');
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
            console.log('Push-Benachrichtigung abonniert...');

            console.log('Sende Push-Abo an Server...');
            await fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Push-Abo an Server gesendet...');
        }

        async function unsubscribeUser(register) {
            console.log('Abmelden von Push-Benachrichtigungen...');
            const subscription = await register.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                console.log('Push-Benachrichtigung abgemeldet...');

                console.log('Sende Abmelde-Info an Server...');
                await fetch('/unsubscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Abmelde-Info an Server gesendet...');
            }
        }

        async function sendPushNotification(register) {
            const message = document.getElementById('notificationMessage').value;
            
            const subscription = await register.pushManager.getSubscription();
            if (subscription) {
                console.log('Sende Push-Benachrichtigung...');
                await fetch('/sendNotification', {
                    method: 'POST',
                    body: JSON.stringify({ subscription, message }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Push-Benachrichtigung gesendet...');
            }
        }

        function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }