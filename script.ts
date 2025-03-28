import * as VIAM from '@viamrobotics/sdk';
// import Cookies from 'js-cookie'; 

let apiKeyId = localStorage.getItem('api_key_id') || '';
let apiKeySecret = localStorage.getItem('api_key_secret') || '';
let machineId = localStorage.getItem('machine_id') || '';

console.log(`apiKeyId: ${apiKeyId}, apiKeySecret: ${apiKeySecret}, machineId: ${machineId}`);

// window.addEventListener('message', async (event) => {
//     if (event.data.data.api_key_id) {
//         apiKeyId = event.data.data.api_key_id;
//     }
//     if (event.data.data.api_key_secret) {
//         apiKeySecret = event.data.data.api_key_secret;
//     }
//     if (event.data.data.machine_id) {
//         machineId = event.data.data.machine_id;
//     }
//     const client = await connect();
//         renderMachineDetails(client);
// });

document.addEventListener('DOMContentLoaded', async () => {
    const client = await connect();
    renderMachineDetails(client);
});

async function connect(): Promise<VIAM.ViamClient> {
    const opts: VIAM.ViamClientOptions = {
        serviceHost: 'https://pr-7603-appmain-bplesliplq-uc.a.run.app/',
        credentials: {
            type: 'api-key',
            authEntity: apiKeyId,
            payload: apiKeySecret,
        },
    };

    return await VIAM.createViamClient(opts);
}

async function renderMachineDetails(client: VIAM.ViamClient): Promise<void> {
    const widgetContent = document.getElementById('widget-content');
    if (!widgetContent) return;

    const parts = await client.appClient.getRobotParts(
        machineId
    );
    if (parts.length === 0) return;
    const part = parts[0];
    try {
        let partialFilter = {
            robotId: machineId,
        }
        const filter = new VIAM.dataApi.Filter(partialFilter);
        const data = await client.dataClient.tabularDataByFilter(
            filter
        );
        if (data.data.length === 0) {
            const dataItem = document.createElement('div');
            dataItem.className = 'data-item';
            dataItem.innerHTML = `
                <span class="label">No data found for part:</span>
                <span class="value">${part.name}</span>
                `;
            widgetContent.appendChild(dataItem);
            return;
        };
        data.data.forEach(data => {
            const dataItem = document.createElement('div');
            dataItem.className = 'data-item';
            dataItem.innerHTML = `
            <span class="label">${data.timeReceived}:</span>
            <span class="value">${JSON.stringify(data.data)}</span>
            `;
            widgetContent.appendChild(dataItem);
        });
    } catch (error) {
        console.error('Failed to get robot part logs:', error);
    }
}