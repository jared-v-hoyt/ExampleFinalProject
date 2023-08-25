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

3. Change to the newly-built directory and run the following command:

    ```bash
    npm install @mui/material @emotion/react @emotion/styled
    ```

    This command installs the [MUI](https://mui.com/material-ui/) library which is a library that provides pre-built React components that conform to Google's [Material](https://m3.material.io/) style guidelines.

4. Open `src/app/page.tsx` and update the file with the following code:

    ```javascript
    
    ```
