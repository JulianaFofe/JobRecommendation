import os
from dotenv import load_dotenv

load_dotenv()



JWT_SECRET = os.getenv("thisisaprivatesecretkey")
JWT_EXPIRES_IN =os.getenv(1)  # in days
ALGORITHM = os.getenv("HS256")
# DATABASE_URL = "mysql+mysqlconnector://root:@127.0.0.1:3306/JobRecommendation"
DATABASE_URL=os.getenv("mysql+mysqlconnector://root:xmrmVYqdsajZvDnLWjXeGZWcuzbZcUEO@yamabiko.proxy.rlwy.net:14490/railway")