export const proxyService = {
    request: async (options: any) => {
        // Simulate an API request
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { message: "Success" } });
            }, 1000);
        });
    }
};
