[![MasterHead](https://user-images.githubusercontent.com/97467803/184258764-c681188d-2d77-44ba-8507-0f739499cfc6.png)](https://share3.vanoob.dev)


<h1 align="center">This is Share<3</h1>
<h5 align="center">A dApp on HOPR mixnet</h5>
<h5 align="center">Share your files privately to others completely securely with HOPR</h5>

## Description
### What is dApp 
A decentralized application (dapp) is an application built on a decentralized network that combines a smart contract and a frontend user interface.

### What this app is doing
It is a File sharing app on hopr network.
It is converting files into base64 string and dividing into the chunks of 400bytes because max limit of sending msg on nodes is 500bytes, than sending all Encoded chunks of b64 string on node.
and to make file accessable to the user, App collects all chunks(messages) from node and merge all chunks into one base64 string.
Then decodes that string and gives a download link to user.

### Try [Share<3](https://share3.vanoob.dev)

## Changes
- Path selection option is now removed!
- Refresh icon

## Demo video 🎞 👀
### Sharing files with Share3
https://user-images.githubusercontent.com/97467803/184550904-67d8f3c6-1c40-4f6d-ba0e-ce91399a39b2.mp4

### Sharing files between nodes
https://user-images.githubusercontent.com/97467803/184985000-8c8cb85b-f38a-43c6-81b0-e679d285aec4.mp4



## 🚀 Launch a HOPRd cluster

### HOPR Playground
<h5>Ready to use nodes</h5>
https://playground.hoprnet.org/

### Gitpod
https://gitpod.io/#github.com/hoprnet/hoprnet/tree/release/lisbon

## Direct link with api settings
```text
https://share3.vanoob.dev/share?apiEndpoint="https://yourHttpEndpoint.com"&apiToken="yourSecurityToken"
```

## Left to do
- [ ] To make it adaptive for mobile screens 


## Learn about HOPR

- [HOPR Site](https://hoprnet.org/)
- [HOPR Documentation](https://docs.hoprnet.org/)
- [HOPR Repository](https://github.com/hoprnet/hoprnet)

<h2 align="right">Powered by HOPR</h2>
<img align="right" src="https://user-images.githubusercontent.com/97467803/184551287-adc4e457-7069-4ae1-b3a0-2ff644e0a632.png" alt="hopr">
