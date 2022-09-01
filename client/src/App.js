
import React,{useEffect,useState}from "react"
import {Input, Box} from '@chakra-ui/react'
import {ethers} from "ethers"
import {Button} from '@chakra-ui/react'
import bankAbi from "./artifacts/contracts/Bank.sol/Bank.json"
import tokenAbi from "./artifacts/contracts/Token.sol/Token.json"
import addresses from "./artifacts/Addresses.json"
import { Heading } from '@chakra-ui/react'
function App() {
  const [providers,setProvider] = useState(null);
  const [accounts,setAccount] = useState(null);
  const [signers,setSigner] =useState(null);
  const [tokenContract,setTokenContract] = useState(null);
  const [bankContract,setBankContract] = useState(null);
  const [userTotalAmount,setUserTotalAmount] = useState(0);
  const [totalAmount,setTotalAmount] = useState(0);
  const [yieldToken,setYieldToken] = useState(0);
  const [withdraw,setWithdraw] = useState(0);
  const [deposit,setDeposit] = useState(0);
  const [loading,setLoading] = useState(true)

  const connectWeb = async()=>{
    if(typeof window.ethereum !== "undefined"){
      const account = await window.ethereum.request({method:"eth_requestAccounts"})
      const provider = new ethers.providers.Web3Provider(window.ethereum) 
      setAccount(account)
      setProvider(provider)

      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      })
  
      window.ethereum.on('accountsChanged', async function (accounts) {
        setAccount(accounts[0])
        await connectWeb()
      })

      const signer = provider.getSigner();
      if ((await signer.getChainId()) !== 31337){
        alert("Please change your network with Localhost hardhat")
      }
      setSigner(signer)
      const tokenContract = new ethers.Contract(addresses.tokenAddress,tokenAbi.abi,signer)
      const bankContract = new ethers.Contract(addresses.bankAddress,bankAbi.abi,signer)
      setTokenContract(tokenContract)
      setBankContract(bankContract)
      setUserTotalAmount(ethers.utils.formatEther(await bankContract.accounts(await signer.getAddress())));
      setTotalAmount(ethers.utils.formatEther(await bankContract.totalAmount()));
      setYieldToken(ethers.utils.formatEther(await tokenContract.balanceOf(await signer.getAddress())))
      setLoading(false)

    }
    else{
      alert("Install Meta Mask");
    }

  
  }

  useEffect(()=>{
    async function runWeb3(){
      await connectWeb()
    }
    runWeb3()
  },[signers])

  const Withdrawhandler = async(event) =>{
    event.preventDefault();

    try{
    const tx = await bankContract.withdraw(ethers.utils.parseEther(withdraw),addresses.tokenAddress)
    await tx.wait();
    setWithdraw('')
    connectWeb()

    setUserTotalAmount(ethers.utils.formatEther(await bankContract.accounts(await signers.getAddress())));
    setTotalAmount(ethers.utils.formatEther(await bankContract.totalAmount()));
    setYieldToken(ethers.utils.formatEther(await tokenContract.balanceOf(await signers.getAddress())))
    

    }

    catch(error){
      alert(error.data.message.toString())
    }

    
  }

  const Deposithandler = async(event) =>{
    event.preventDefault();
    try{
      const tx = await bankContract.deposit({value:ethers.utils.parseEther(deposit)})
      await tx.wait();
      setDeposit('')
      connectWeb()

      setUserTotalAmount(ethers.utils.formatEther(await bankContract.accounts(await signers.getAddress())));
      setTotalAmount(ethers.utils.formatEther(await bankContract.totalAmount()));
      setYieldToken(ethers.utils.formatEther(await tokenContract.balanceOf(await signers.getAddress())))

    }
    catch(error){
      alert(error.data.message.toString())
    }


  }

  return (
    <div className="text-2xl flex justify-center mt-20" >
    <Box w="800px" h="700px" maxW='md' borderWidth='3px' borderRadius='lg' overflow='hidden'>
    {loading?"":(
      <Heading className="ml-14 text-3xl">{accounts}</Heading>
    )}
    <p className="ml-64 text-3xl">Decentralized dapps</p>
    <p className="ml-64">User Total Assets: {userTotalAmount}</p>
    <p className="ml-64">Total Assets: {totalAmount}</p>
    <p className="ml-64">Amount of Yield Tokens: {yieldToken}</p>
    <div className="">
    <Input type="decimal"  placeholder='Deposit' size='lg' w="200p" borderWidth='2px'
     className='flex justify-center items-center ml-64 mt-12 pl-2'
     border="2px solid black" value={deposit} onChange={(e) => setDeposit(e.target.value)}  />
    <Button colorScheme='blue' borderWidth='2px' w="150px" 
       className='flex justify-center mr-10 rounded bg-sky-500/50 hover:bg-sky-600 
       active:bg-sky-400 ml-80 mt-5 ' onClick={Deposithandler} >deposit</Button>

    </div>


    <Input type="decimal"  placeholder='Withdraw' size='lg' w="200p" borderWidth='2px'
     className='flex justify-center items-center ml-64 mt-12 pl-2'
     border="2px solid black" value={withdraw} onChange={(e)=>setWithdraw(e.target.value)} />

    <Button colorScheme='blue' borderWidth='2px' w="150px" 
       className='flex justify-center mr-10 rounded bg-teal-500 hover:bg-teal-600 
       active:bg-teal-400 ml-80 mt-5 ' onClick={Withdrawhandler} >Withdraw</Button>


    </Box>

  </div>
  );
}

export default App;
