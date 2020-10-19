require('dotenv').config();
const execShPromise = require("exec-sh").promise;

(async () => {
    let is_running = false;
    setInterval(async () => {

        const date = new Date();
        const folder_name = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}/${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;

        if (is_running) {
            console.log('[task]', new Date(), 'another task is already running');
            return;
        }
        console.log('[task]', new Date(), 'Task starts to run');
        is_running = true;

        // dump the result to a folder
        await execShPromise(`mkdir -p ${process.env.BASE_DIR}${folder_name}`).catch(() => console.log('[task.error]', 'in:', `mkdir -p ${folder_name}`));
        await execShPromise(`cd ${process.env.BASE_DIR}${folder_name}`).catch(() => console.log('[task.error]', 'in:', `cd ${folder_name}`));
        await execShPromise(`mongodump --db=${process.env.MONGO_DB_DATABASE} --port=${process.env.MONGO_DB_PORT} --username=${process.env.MONGO_DB_USER} --password=${process.env.MONGO_DB_PASSWORD} --authenticationDatabase=${process.env.MONGO_DB_AUTH} --out=${process.env.MONGO_DB_DATABASE}`).catch(() => console.log('[task.error]', 'in:', 'mongodump'));

        console.log('[task]', new Date(), 'Backup folder is:-', folder_name);

        is_running = false;
        console.log('[task]', new Date(), 'Task is finished');

    }, parseInt(process.env.RUNNING_EVERY || 1) * 1000 * 60 * 60)

})();