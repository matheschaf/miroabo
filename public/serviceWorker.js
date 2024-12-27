self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push-Benachrichtigung empfangen:', data);
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        data: {
            url: data.url  // URL zur Benachrichtigung hinzufügen
        }
    };
    self.registration.showNotification(data.title, options);
});

// Füge einen Event Listener hinzu, um Klicks auf die Benachrichtigung zu verarbeiten
self.addEventListener('notificationclick', event => {
    console.log('Benachrichtigung geklickt:', event.notification.data.url);
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === event.notification.data.url && 'focus' in client) {
                    console.log('Fokus auf bestehendes Fenster:', client.url);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                console.log('Öffne neues Fenster:', event.notification.data.url);
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
