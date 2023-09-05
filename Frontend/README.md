# Frontend

In this example, we will be building our frontend using [Next.js](https://nextjs.org/), one of the fastest-growing and most popular [React](https://react.dev/) frameworks for companies worldwide. I will not be discussing the intricacies of Next.js or React in this repository, but I highly recommend going through each of the tutorials on their websites to get a basic understanding of both technologies.

## Steps To Recreate The Project

1. Download the following tools (if you haven't already):

    - [Node.js](https://nodejs.org/en)
    - [Visual Studio Code](https://code.visualstudio.com/)
        - **Javascript and TypeScript Nightly** extension from *Microsoft*

2. Create a new Next.js project by running the following command in a terminal:

    ```bash
    npx create-next-app@latest
    ```

    You will be taken through a series of questions regarding your application. I recommend using the following parameters:

    - *What is your project named?*: **anything**
    - *Would you like to use TypeScript*: **Yes**
    - *Would you like to use ESLint?*: **Yes**
    - *Would you like to use Tailwind CSS?*: **No**
    - *Would you like to use `src/` directory?*: **Yes**
    - *Would you like to use App Router? (recommended)*: **Yes**
    - *Would you like to customize the default import alias?*: **No**

3. Run the project by changing into the project's directory and running the following command:

    ```bash
    npm run dev
    ```

    Navigate to `localhost:3000` to view the web page. Any changes made to the project will hot-reload and be updated in the browser; there is no need to stop and start the project to see the changes.

4. We need to first remove all of the boilerplate code that gets created on project initialization.

    First, navigate to `/src/app/globals.css` and update the contents of the file with the following code:

    ```css
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    ```

    Next, navigate to `/src/app/page.tsx` and update the contents of the file with the following code:

    ```javascript
    import styles from "./page.module.css"

    export default function Home() {
      return (
        <main className={styles.main}>
          <h1>Home</h1>
        </main>
      )
    }
    ```

    **Note:** here we're using the `<main>` tag instead of the `<div>` tag. Both tags will create the same component, but using the `<main>` tag is semantically more correct. To learn more about semantic tags, check out [this video](https://www.youtube.com/watch?v=duoNlz5uTYk&list=LL&index=15) on YouTube.

    Lastly, navigate to `/src/app/page.module.css` and update the contents of the file with the following code:

    ```css
    .main {
      height: calc(100vh - 5rem);
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ```

    We now have a blank project that we can work in.

5. We'll start by first creating the available routes for the application. The application will only have one route: `<base_url>/products`. To create this route, create the `/src/app/products` directory and create two files: `page.tsx` and `page.module.css` in this new directory. Update `page.tsx` with the following code:

    ```javascript
    import styles from "./page.module.css"

    export default function Products() {
      return (
        <main className={styles.main}>
          <h1>Products</h1>
        </main>
      )
    }
    ```

    You can now navigate to `localhost:3000/products` to see the new component. To learn more about routing, check out [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing) from the Next.js documentation.

6. To be able to navigate between these routes without directly typing the URLs in, we need to create a navigation bar that users can interact with. Create the `src/components/NavigationBar` directory.

    Create a file named `NavigationBar.tsx` in the `NavigationBar` directory and update it with the following code:

    ```javascript
    import Link from 'next/link';

    import styles from "./NavigationBar.module.css";

    export type PageLink = {
      link_text: string,
      link_url: string
    }

    export type NavigationBarProps = {
      links: Array<PageLink>
    }

    export default function NavigationBar(props: NavigationBarProps) {
      return (
        <nav className={styles.navigation_bar}>
          <Link href="/">
            <h1>Logo</h1>
          </Link>

          <ul>
            {props.links.map((link) => {
              return (
                <li key={link.link_url}>
                  <Link href={`/${link.link_url}`}>
                    {link.link_text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      );
    }
    ```

    Create a file named `NavigationBar.module.css` in the same directory and update it with the following code:

    ```css
    .navigation_bar {
      position: sticky;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 5rem;
      width: 100vw;
      padding: 0 10rem;
      background-color: white;
      box-shadow: 0px 0px 20px 1px rgba(240, 240, 240, 1);
    }

    .navigation_bar ul {
      display: flex;
      gap: 2rem;
      align-items: center;
      list-style: none;
    }
    ```

7. We want the navigation bar to be present on each page of the application, so we need to add the component to the layout at the root of the application. Navigate to `/src/app/layout.tsx` and update the file with the following code:

    ```javascript
    import "./globals.css";
    import type { Metadata } from "next";
    import { Inter } from "next/font/google";
    import NavigationBar, { PageLink } from "@/components/NavigationBar/NavigationBar";

    const inter = Inter({ subsets: ["latin"] });
    const links: Array<PageLink> = [
      {
        link_text: "Products",
        link_url: "products"
      }
    ]

    export const metadata: Metadata = {
      title: "Frontend Setup",
      description: "A website demonstrating interaction between frontend and backend services.",
    }

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body className={inter.className}>
            <NavigationBar links={links} />
            {children}
          </body>
        </html>
      )
    }
    ```

8. In order to display products to the user, we first need to create a *card* that is capable of displaying information about the product such as its image, name, and price. Create the `/src/components/ProductCard` directory and two files inside of the `ProductCard` directory: `ProductCard.tsx` and `ProductCard.module.css`. Update `ProductCard.tsx` with the following code:

    ```javascript
    import Image from "next/image";
    import styles from "./ProductCard.module.css";
    import { Product } from "@/app/products/page";

    export default function ProductCard(props: Product) {
      const product_image = require("@/assets/Product Images/" + props.productName + ".webp");

      const US_dollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

      return (
        <div className={styles.product_card}>
          <Image
            className={styles.product_image}
            src={product_image}
            alt={props.productName}
            height="175"
            width="250"
          />

          <div className={styles.product_information}>
            <div className={styles.product_name}>
              {props.productName}
            </div>

            <div className={styles.unit_price}>
              {US_dollar.format(props.unitPrice)}
            </div>
          </div>
        </div>
      );
    }
    ```

    and update `ProductCard.module.css` with the following code:

    ```css
    .product_card {
      height: 250px;
      width: 250px;
      border: 1px solid rgb(240, 240, 240);
      border-radius: 10px;
      box-shadow: 0px 0px 20px 1px rgb(240, 240, 240);
    }

    .product_card:hover {
      cursor: pointer;
    }

    .product_image {
      height: 70%;
      width: 100%;
      object-fit: contain;
    }

    .product_information {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
    }

    .product_name {
      font-size: 12px;
    }

    .unit_price {
      font-size: 10px;
      color: lightgrey;
    }
    ```

9. Before we create the actual product page, we need to add the product images to the project. Create the `/src/assets/Product Images` directory and add all of the images from [here](https://github.com/jared-v-hoyt/FinalProjectSetup/tree/main/Frontend/assets/Product%20Images) to the new directory.

10. Finally, update `/src/app/products/page.tsx` with the following code:

    ```javascript
    "use client";

    import { useEffect, useState } from "react";
    import styles from "./page.module.css";
    import ProductCard from "@/components/ProductCard/ProductCard";

    // These keys MUST be in camel case
    export type Product = {
      productId: number,
      productName: string,
      unitPrice: number
    }

    export default function Products() {
      const [is_loading, set_is_loading] = useState(true);
      const [product_list, set_product_list] = useState<Array<Product>>([]);

      useEffect(() => {
        var request_options: RequestInit = {
          method: "GET",
          redirect: "follow"
        };

        fetch("http://localhost:5019/api/product", request_options)
          .then(response => response.json())
          .then(result => set_product_list(result))
          .catch(error => console.log("Error: ", error))
          .finally(() => set_is_loading(false));
      }, []);

      return (
        <main className={styles.main}>
          {is_loading
            ?
            <h1>Loading...</h1>
            :
            <div className={styles.grid}>
              {product_list.map((product) => {
                return (
                  <ProductCard
                    key={product.productId}
                    productId={product.productId}
                    productName={product.productName}
                    unitPrice={product.unitPrice}
                  />
                );
              })}
            </div>
          }
        </main>
      );
    }
    ```

    and update `/src/app/products/page.module.css` with the following code:

    ```css
    .main {
      min-height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 10rem;
    }

    .grid {
      display: grid;
      row-gap: 2rem;
      column-gap: 2rem;
      grid-template-columns: repeat(4, 250px);
    }
    ```

    The application should now be able to pull data from our backend and display the information to the user.
