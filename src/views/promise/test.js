async function main() {
    const res = await foo(2);
    console.log("🚀 ~ main ~ res:", res)
}

main()

async function foo(data) {
    if(data === 1) {
        const a =  await step1();
        console.log("🚀 ~ foo ~ a:", a)
        return a;
    }
    if(data === 2) {
        return step2();
    }
}


async function step1() {
    console.log("step1 startttt");

    // return Promise.resolve('step1');

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('step1');
        }, 1000);
    });
}

async function step2() {
    console.log("step2 start");
    await waitSeconds(1);
    const res = await step3();
    console.log("🚀 ~ step2 ~ res:", res)
    return res + "---" + 'step2'
}

async function step3() {
    console.log("step3 start");
    await waitSeconds(1);
    return Promise.resolve('step3');
}


async function waitSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}