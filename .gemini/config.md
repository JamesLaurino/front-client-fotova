# Guide de Style et Architecture du Projet `front-client-fotova`

Ce document décrit l'architecture, les conventions de nommage et les patrons de conception utilisés dans le projet `front-client-fotova`. Il sert de référence pour tout développement futur afin de maintenir la cohérence et la qualité du code.

## 1. Vue d'ensemble du Projet

*   **Framework Principal :** **Angular** (v17+ avec Signals)
*   **Langage :** **TypeScript**
*   **Styling :** **CSS** standard (fichiers `.css` dédiés par composant).
*   **Architecture :** Application monopage (SPA) modulaire, réactive, orientée fonctionnalités ("feature-based").
*   **Objectif :** Application e-commerce avec une partie cliente (vitrine, panier, commande) et une interface d'administration.

## 2. Architecture Générale

Le projet suit une architecture modulaire où chaque grande fonctionnalité est isolée dans son propre dossier.

*   **Découpage par Fonctionnalité (Feature-Sliced) :** Le dossier `src/app` est organisé par domaines métier (ex: `admin`, `cart`, `category`, `user`). Chaque dossier contient tous les éléments relatifs à cette fonctionnalité (composants, services, modèles).
*   **Logique Métier dans les Services :** La logique complexe et les appels API sont encapsulés dans des **services**. Les services retournent principalement des `Observables` RxJS.
*   **Gestion d'état :** La gestion d'état est principalement réactive, en utilisant les **Signals** d'Angular pour l'état local du composant et les **Observables RxJS** pour les flux de données asynchrones.
*   **Modèles de Données Fortement Typés :** Le dossier `src/app/model` centralise toutes les interfaces et classes TypeScript.
*   **Routage :** Le routage principal est défini dans `src/app/app.routes.ts`, probablement avec chargement paresseux (lazy loading).
*   **Protection des Routes (Guards) :** Le dossier `src/app/core` contient des `Guards` pour sécuriser l'accès aux routes.
*   **Fonctions Utilitaires (Helpers) :** Le dossier `src/app/helper` contient des classes ou fonctions pures pour des logiques transverses.

## 3. Structure des Dossiers Clés

*   `src/app/admin/` : Composants de l'interface d'administration.
*   `src/app/cart/` : Panier et processus de paiement (`checkout`).
*   `src/app/core/` : Services fondamentaux et gardiens de route.
*   `src/app/model/` : Définition des structures de données.
*   `src/app/service/` : Services injectables pour la logique métier et les appels HTTP.
*   `src/app/share/` : Composants partagés (navbar, footer).
*   `src/app/{feature}/` : Dossier pour une fonctionnalité spécifique.

## 4. Conventions de Nommage

(Identique à la version précédente : `kebab-case` pour les fichiers, `PascalCase` pour les classes, `camelCase` pour les variables/méthodes).

## 5. Structure d'un Composant

Un composant est systématiquement éclaté en trois fichiers distincts :
1.  **`mon-composant.ts`**
2.  **`mon-composant.html`**
3.  **`mon-composant.css`**

## 6. Conventions Modernes d'Angular (v17+)

Cette section détaille l'utilisation des API réactives et modernes d'Angular.

### a. Blocs de Contrôle de Flux dans les Templates

*   **Utilisation systématique :** Le projet utilise exclusivement la nouvelle syntaxe de contrôle de flux intégrée (`@if`, `@for`, `@switch`) dans les templates HTML.
*   **Abandon des directives structurelles :** Les directives `*ngIf`, `*ngFor`, et `ngSwitch` sont proscrites au profit de la nouvelle syntaxe, plus performante et lisible.

    ```html
    <!-- A privilégier -->
    @if (user()) {
      <div>{{ user().name }}</div>
    } @else {
      <div>Veuillez vous connecter.</div>
    }

    <!-- A ne plus utiliser -->
    <!-- <div *ngIf="user as u; else loading">...</div> -->
    ```

### b. Gestion d'État avec les Signals

*   **État local :** L'état interne des composants est géré avec les **Signals**.
    *   `signal()` : Pour les valeurs d'état modifiables.
    *   `computed()` : Pour les valeurs dérivées d'autres signals.
    *   `effect()` : Pour les effets de bord (ex: logging, mise à jour du `localStorage`) qui réagissent aux changements de signals.

    ```typescript
    // Dans un composant
    quantity = signal(1);
    product = signal<Product>({ name: 'Pomme', price: 2 });
    totalPrice = computed(() => this.product().price * this.quantity());

    increment() {
      this.quantity.update(q => q + 1);
    }
    ```

### c. Intégration de RxJS et des Signals ("rxRessources")

*   **Source de données :** Les services continuent de retourner des **Observables RxJS** pour les opérations asynchrones (appels HTTP, WebSockets, etc.).
*   **Consommation dans le composant :** Pour utiliser ces flux de données dans le contexte des Signals, la fonction `toSignal` de `@angular/core/rxjs-interop` est utilisée. Cela permet de convertir un `Observable` en `Signal` et de bénéficier d'une gestion d'état unifiée.

    ```typescript
    // Dans un service
    getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>('/api/products');
    }

    // Dans un composant
    productService = inject(ProductService);
    products = toSignal(this.productService.getProducts(), { initialValue: [] });

    // Le template peut maintenant utiliser le signal `products` directement
    ```
*   **Pipe `async` :** L'utilisation du pipe `async` reste une option viable, mais la conversion en `Signal` est préférée pour la cohérence de la gestion d'état au sein du composant.
