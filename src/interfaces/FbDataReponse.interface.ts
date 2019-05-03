export interface IFbLoginResponse {
    id: string;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    picture: {
                data:
                {
                    height: number,
                    is_silhouette: boolean,
                    url: string,
                    width: number
                }
            };
}
