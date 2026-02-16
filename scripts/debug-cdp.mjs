import http from 'http';

// Check all CDP ports
const PORTS = [7000, 9000, 9001, 9002, 9003];

function getJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('=== CDP Debug Tool ===\n');
    
    for (const port of PORTS) {
        try {
            console.log(`Checking port ${port}...`);
            const list = await getJson(`http://127.0.0.1:${port}/json/list`);
            console.log(`✅ Port ${port} is active! Found ${list.length} targets:\n`);
            
            list.forEach((target, i) => {
                console.log(`  [${i}] ${target.title}`);
                console.log(`      URL: ${target.url}`);
                console.log(`      Type: ${target.type}`);
                console.log(`      ID: ${target.id}`);
                console.log('');
            });
        } catch (e) {
            console.log(`❌ Port ${port}: ${e.message}\n`);
        }
    }
}

main();
