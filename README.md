[![MasterHead](https://user-images.githubusercontent.com/97467803/184258764-c681188d-2d77-44ba-8507-0f739499cfc6.png)](https://share3.vanoob.dev)


<h1 align="center">This is Share<3</h1>
<h5 align="center">A dApp on HOPR mixnet</h5>

## Description
### What is dApp 
A decentralized application (dapp) is an application built on a decentralized network that combines a smart contract and a frontend user interface.

### What this app is doing
It is a File sharing app on hopr network.
It is converting files into base64 string and dividing into the chunks of 400bytes because max limit of sending msg on nodes is 500bytes, than sending all Encoded chunks of b64 string on node.
and to make file accessable to the user, App collects all chunks(messages) from node and merge all chunks into one base64 string.
Then decodes that string and gives a download link to user.

### Try [dApp](https://share3.vanoob.dev)

## Demo video

![demo](https://user-images.githubusercontent.com/97467803/180613164-e9ad8594-c42c-4bdf-8bb1-1abe920585cf.gif)

[To know how to use this app see full video](https://vimeo.com/732748433)

## Direct link with api settings using url 
```text
https://share3.vanoob.dev/share?apiEndpoint="https://yourHttpEndpoint.com"&apiToken="yourSecurityToken"
```


## Learn about HOPR

- [HOPR Site](https://hoprnet.org/)
- [HOPR Documentation](https://docs.hoprnet.org/)
- [HOPR Repository](https://github.com/hoprnet/hoprnet)

<h2 align="right">Powered by HOPR</h2>
