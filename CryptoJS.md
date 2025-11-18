# AES

AES的学习可以看[B站视频](https://www.bilibili.com/video/BV1seFJeHEnm/?spm_id_from=333.337.search-card.all.click&vd_source=5b44e789c3417bff8a1a68483f131aed)

## `CryptoJS.AES`的使用

四个参数：key, mode, padding, IV

- key: 密钥，加密 / 解密的核心钥匙，字符串长度16/24/32个字符
- mode: 模式，加密算法的工作模式，常用 CBC（推荐，需 IV）
- padding: 填充，当明文长度不是加密块（128 位）整数倍时补全，常用 Pkcs7（默认）。AES在加密前会将数据进行分组，每组128bit，最后一组不够就加上padding。
- IV：偏移量，配合 CBC 等模式使用，避免相同明文加密出相同密文，必须是 128 位（16 个字符），需随机生成（解密时需用相同 IV）

### 加密

无论是密钥还是明文，它们都是string类型的数据，都需要解析成CryptoJS专用的WordArray对象

1. 解析明文和密钥：
  
  ```ts
  const WADate = CryptoJS.enc.Utf8.parse(data);
  const WASecretKey = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  ```
  
2. 选择模式和填充：
  
  ```ts
  const mode = CryptoJS.mode.CBC;
  const padding = CryptoJS.pad.Pkcs7;
  ```
  
3. 获取偏移量，随机16位字符串，同样也需要WordArray格式：
  
  ```ts
  const iv = CryptoJS.lib.WordArray.random(16);
  ```
  
4. 开始加密：
  
  ```ts
  const encrypted = CryptoJS.AES.encrypt(WAData, WASecretKey, {iv, mode, padding});
  ```
  

一个注意的点：我们将utf8的数据转换为了WordArray，但是WordArray转换为utf8的字符串时会出现不可打印的特殊字符（比如 `\x00`、`\x1F`），导致传输时被截断、存储时乱码。所以我们转回JS字符串时使用Base64编码方式把二进制数据转换成 `A-Za-z0-9+/=` 组成的字符串，是前端传输 / 存储二进制数据的 “通用安全格式”（不会出现乱码、截断问题）。

```ts
iv.toString(CryptoJS.enc.Base64);
```

而不是：

```ts
iv.toString(CryptoJS.enc.Utf8);
```

5. 返回加密成果：
  
  ```ts
  const encryptedResult = iv.toString(CryptoJS.enc.Base64) + "$" + encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  ```
  

iv在解密时会用到，所以一并返回了，用`$`隔开，冒号也行。

### 解密

1. 首先将iv和encrypted分开：
  
  ```ts
  const [ivBase64, ciphertextBase64] = encryptedResult.split('$');
  ```
  
2. 这时将两者转换为WordArray的数据格式：
  
  ```ts
  const iv = CryptoJS.enc.Base64.parse(ivBase64);
  const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64);
  ```
  
3. 由于之前加密返回时返回的是`encrypted.ciphertext.toString(CryptoJS.enc.Base64)`, 现在我们的ciphertext是纯裸奔密文，还需要一层容器包裹成为encrypted，如果当初传回的是`encrypted.toString(...)`就不需要下面的步骤：
  
  ```ts
  const cipherParams = CryptoJS.lib.CipherParams.create({ciphertext});
  ```
  
4. 开始解密，当然，参数和加密相同：
  
  ```ts
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {iv, mode, padding}
  );
  ```
  
5. 返回明文：
  
  ```ts
  const decryptResult = decrypted.toString(CryptoJS.enc.Utf8);
  ```
