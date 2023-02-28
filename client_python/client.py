import os
import json
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

PRIVATE_KEY = os.getenv('PRIVATE_KEY')
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
NETWORK = os.getenv('NETWORK')
INFURA_API_KEY = os.getenv('INFURA_API_KEY')

infura_url = f"https://{NETWORK}.infura.io/v3/{INFURA_API_KEY}"


class Client:
    def __init__(self):
        self.web3 = Web3(Web3.HTTPProvider(infura_url))

        self.web3.default_account = self.web3.eth.account.from_key(PRIVATE_KEY)
        self.from_address = self.web3.default_account.address
        self.nonce = self.web3.eth.getTransactionCount(self.from_address)
        with open('../artifacts/contracts/HSEToken.sol/HSEToken.json') as f:
            info_json = json.load(f)
        abi = info_json["abi"]

        self.contract = self.web3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

        self.event_filter = self.web3.eth.filter({"address": CONTRACT_ADDRESS})

    def getStudent(self, id):
        return self.contract.functions.getStudent(id).call()
    
    def sendTransaction(self, call_function):
        signed_tx = self.web3.eth.account.sign_transaction(call_function, private_key=PRIVATE_KEY)
        send_tx = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = self.web3.eth.wait_for_transaction_receipt(send_tx)
        tx_hash = receipt['transactionHash'].hex()
        return f'https://{NETWORK}.etherscan.io/tx/{tx_hash}'


    def setStudent(self, id, name, mark, isLanguageJS = False):
        call_function = self.contract.functions.setStudent(id, name, mark, isLanguageJS).buildTransaction({
            'from': self.from_address,
            'nonce': self.nonce
        })

        return self.sendTransaction(call_function)

    def deleteStudent(self, id):
        call_function = self.contract.functions.deleteStudent(id).buildTransaction({
            'from': self.from_address,
            'nonce': self.nonce
        })
        
        return self.sendTransaction(call_function)
    
    def filterByName(self, name):
        event_filter = self.contract.events.SetStudent.createFilter(fromBlock=0, toBlock='latest', argument_filters={'name': name})
        return event_filter.get_new_entries()

def str_to_bool(str):
    return bool(json.loads(str.lower()))

def run_client():
    client = Client()
    while True:
        command = input().split()
        try:
            if command[0] == 'set':
                assert(len(command) == 4 or len(command) == 5)
                id = int(command[1])
                name = command[2]
                mark = int(command[3])
                isLanguageJS = str_to_bool(command[4]) if len(command) == 5 else False
                print(f'> Set transaction: {client.setStudent(id, name, mark, isLanguageJS)}')
            elif command[0] == 'get':
                assert(len(command) == 2)
                result = client.getStudent(int(command[1]))
                print(f'> Get result. Name: {result[0]}, mark: {result[1]}, isLanguageJS: {result[2]}')
            elif command[0] == 'delete':
                assert(len(command) == 2)
                print(f'> Delete transaction: {client.deleteStudent(int(command[1]))}')
            elif command[0] == 'filter':
                assert(len(command) == 2)
                print(f'> Filter info: {client.filterByName(command[1])}')
        except Exception as e:
            print(f'> Wrong command. Command: "{" ".join(command)}". Error: {e}')


if __name__ == '__main__':
    run_client()