import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.HASURA_GRAPHQL_URL!;
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET!;


const headers = {
    "content-type" : "application/json",
    "x-hasura-admin-secret" : HASURA_GRAPHQL_ADMIN_SECRET
}

async function graphql(
  query: string,
  variables?: Record<string, any>,
  method?: string,
): Promise<any> {

  const hasura_response = await axios({
    url: URL,
    method: method ? method.toUpperCase() : 'POST',
    headers,
    data: {
      "query" : query,
      "variables" : variables || {}
    }
  })



  return hasura_response.data
}

export default graphql