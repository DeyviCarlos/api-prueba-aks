import { config } from "dotenv";
// import {ShareServiceClient} from '@azure/storage-file-share'
import azureStorage from 'azure-storage'

config()

//puerto y host
export const PORT= process.env.PORT || 3000
export const HOST= process.env.HOST || 'localhost'


//BD
export const DB_name = process.env.DB_name || 'sana_natural'
export const DB_hostname = process.env.DB_hostname || 'localhost'
export const DB_username = process.env.DB_username || 'root'
export const DB_password = process.env.DB_password || 'piaget1993'
export const DB_port = process.env.DB_port || 3306
//conexión a ssl de la BD local
// export const BD_SSL= process.env.BD_SSL
//conexión a ssl de la BD en Azure

// export const BD_SSL ={ getStorageAccountNameFile: () => {
//         const matches = /AccountName=(.*?)/.exec(process.env.AZURE_STORAGE_CONNECTION_STRING);
//         return matches[1];
//     }
// }


//conexión a Azure Store Account a los recursos compartidos (Archivos)
// export const BD_SSL = { 
//     getSSL: () => {
//         const serviceClient = ShareServiceClient.fromConnectionString(process.env.CONNECTION_STRING);
//         const shareName = process.env.SHARED_RESOURCE;
//         const directoryName = process.env.DIRECTORY_NAME;
//         const shareClient = serviceClient.getShareClient(shareName);
//         const directoryClient  = shareClient.getDirectoryClient(directoryName);
        
//         return directoryClient.url
//     }
// }

//conexión a mercado pago
export const ACCESS_TOKEN_MERCADO_PAGO = process.env.ACCESS_TOKEN_MERCADO_PAGO


//conexión al Store image de Azure
export const _module = {
    getStorageAccountName: () => {
        const matches = /AccountName=(.*?)/.exec(process.env.AZURE_STORAGE_CONNECTION_STRING);
        console.log("Account Name: ",matches)
        return matches[1];
    }
}

export const blobService = azureStorage.createBlobService(); //devuelve la variable de conexion AZURE_STORAGE_CONNECTION_STRING del .env
export const containerName = 'uploads';

export const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./,'');
    return `${identifier}-${originalName}`;
};



/*paypal*/
// export const PAYPAL_API_CLIENT = 'AQyxvbC5hQALoo3GkeatkLLOp31MZS3FfVsWlmf8qudXvbDM-BPFFkrO1Wj1_tCbq6Ng5L7VT7xAaPmr'
// export const PAYPAL_API_SECRET = 'EPtq8MfjJmvT3_6CJx2M0RqTEAaD91Nelkxl0XSMDqf5T9P5137ZeLuvfjxenrDfn_pyFuBUqyABFyf5'
// export const PAYPAL_API = 'https://api-m.sandbox.paypal.com'

