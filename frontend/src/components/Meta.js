import { Helmet } from "react-helmet-async"


const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
        <title>{title} </title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'The Blue Belt',
    description: 'We sell all types of Ribbons for Printing and Wrapping Services',
    keywords: 'ribbon, ribbons dubai, buy ribbons uae, wholesale ribbons',
}


export default Meta