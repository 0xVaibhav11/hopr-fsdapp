## File Sharing Dapp
### What is dApp 
A decentralized application (dapp) is an application built on a decentralized network that combines a smart contract and a frontend user interface.

### What this app is doing
It is a File sharing app on hopr network.
It is converting files into base64 string and dividing into the chunks of 400bytes because max limit of sending msg on nodes is 500bytes, than sending all Encoded chunks of b64 string on node.
and to make file accessable to the user, App collects all chunks(messages) from node and merge all chunks into one base64 string.
Then decodes that string and gives a download link to user.

#### [Vist dApp](https://share3.vanoob.dev)

# Demo video

![demo](https://user-images.githubusercontent.com/97467803/180613164-e9ad8594-c42c-4bdf-8bb1-1abe920585cf.gif)

[To know how to use this app see full video](https://vimeo.com/732748433)


# powered by HOPR
