import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CollectionDisplayName = ({collection_name}: {collection_name: string}) => {
  const [collectionDisplayName, setCollectionDisplayName] = useState('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  useEffect(() => {
    const collections = collection_name.split(',')
    if(collection_name && collections.length === 1) {
      fetch(`https://proton.api.atomicassets.io/atomicassets/v1/collections/${collection_name}`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if(data.success) {
          setErrorMsg('')
          setCollectionDisplayName(data.data.name)
        } else {
          setErrorMsg(data.message)
          setCollectionDisplayName('')
        }
      })
    } else if (collections.length > 1) {
      setErrorMsg('Display Name is only rendered for single input.')
      setCollectionDisplayName('')
    } else {
      setErrorMsg('')
      setCollectionDisplayName('')
    }
  }, [collection_name]);

  return (
    <>
      <div>{!errorMsg && collectionDisplayName !== '' && <>Display Name: <Link className="underline" to={`https://soon.market/collections/${collection_name}`} target="_blank">{collectionDisplayName}</Link></>}</div>
      <div>{!errorMsg && collectionDisplayName === '' && <>Display Name: awaiting input</>}</div>
      <div>{errorMsg && <>{errorMsg}</>}</div>
    </>
  );
};
export default CollectionDisplayName;